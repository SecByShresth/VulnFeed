// Cloudflare Worker - API Proxy for Asset Scanner
// Deploy this to Cloudflare Workers (free tier available)
// =====================================================

// API Keys - Set these as environment variables in Cloudflare Workers
// Go to: Workers & Pages → Your Worker → Settings → Variables
const getApiKeys = (env) => ({
    CENSYS_TOKEN: env.CENSYS_API_TOKEN || '',
    SHODAN_KEY: env.SHODAN_API_KEY || '',
    ABUSEIPDB_KEY: env.ABUSEIPDB_API_KEY || '',
    VT_KEY: env.VT_API_KEY || ''
});

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const target = url.searchParams.get('target');

        if (!target) {
            return jsonResponse({ error: 'Missing target parameter' }, 400);
        }

        const API_KEYS = getApiKeys(env);

        try {
            let result;

            switch (path) {
                case '/api/abuseipdb':
                    result = await scanAbuseIPDB(target, API_KEYS.ABUSEIPDB_KEY);
                    break;
                case '/api/virustotal':
                    result = await scanVirusTotal(target, API_KEYS.VT_KEY);
                    break;
                case '/api/shodan':
                    result = await scanShodan(target, API_KEYS.SHODAN_KEY);
                    break;
                case '/api/censys':
                    result = await scanCensys(target, API_KEYS.CENSYS_TOKEN);
                    break;
                case '/api/scan-all':
                    result = await scanAll(target, API_KEYS);
                    break;
                default:
                    return jsonResponse({
                        error: 'Unknown endpoint',
                        available: ['/api/abuseipdb', '/api/virustotal', '/api/shodan', '/api/censys', '/api/scan-all']
                    }, 404);
            }

            return jsonResponse(result);
        } catch (error) {
            return jsonResponse({ error: error.message }, 500);
        }
    }
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}

// AbuseIPDB Scanner
async function scanAbuseIPDB(target, apiKey) {
    if (!apiKey) {
        return { source: 'AbuseIPDB', success: false, error: 'API key not configured' };
    }

    try {
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${target}&maxAgeInDays=90`, {
            headers: {
                'Key': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            source: 'AbuseIPDB',
            success: true,
            data: data.data
        };
    } catch (error) {
        return {
            source: 'AbuseIPDB',
            success: false,
            error: error.message
        };
    }
}

// VirusTotal Scanner
async function scanVirusTotal(target, apiKey) {
    if (!apiKey) {
        return { source: 'VirusTotal', success: false, error: 'API key not configured' };
    }

    try {
        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
        const endpoint = isIP ? 'ip_addresses' : 'domains';

        const response = await fetch(`https://www.virustotal.com/api/v3/${endpoint}/${target}`, {
            headers: {
                'x-apikey': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            source: 'VirusTotal',
            success: true,
            data: data.data
        };
    } catch (error) {
        return {
            source: 'VirusTotal',
            success: false,
            error: error.message
        };
    }
}

// Shodan Scanner
async function scanShodan(target, apiKey) {
    if (!apiKey) {
        return { source: 'Shodan', success: false, error: 'API key not configured' };
    }

    try {
        const response = await fetch(`https://api.shodan.io/shodan/host/${target}?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            source: 'Shodan',
            success: true,
            data: data
        };
    } catch (error) {
        return {
            source: 'Shodan',
            success: false,
            error: error.message
        };
    }
}

// Censys Scanner - Using Personal Access Token (Bearer auth)
async function scanCensys(target, apiToken) {
    if (!apiToken) {
        return { source: 'Censys', success: false, error: 'API key not configured' };
    }

    try {
        // Using Bearer token authentication for Personal Access Tokens
        const response = await fetch(`https://search.censys.io/api/v2/hosts/${target}`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        return {
            source: 'Censys',
            success: true,
            data: data
        };
    } catch (error) {
        return {
            source: 'Censys',
            success: false,
            error: error.message
        };
    }
}

// Scan All APIs (excluding Censys)
async function scanAll(target, apiKeys) {
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);

    const scanPromises = [
        scanAbuseIPDB(target, apiKeys.ABUSEIPDB_KEY),
        scanVirusTotal(target, apiKeys.VT_KEY)
    ];

    // IP-only scans
    if (isIP) {
        scanPromises.push(scanShodan(target, apiKeys.SHODAN_KEY));
    }

    const results = await Promise.all(scanPromises);

    return {
        target: target,
        type: isIP ? 'IP Address' : 'Domain',
        timestamp: new Date().toISOString(),
        scans: results
    };
}
