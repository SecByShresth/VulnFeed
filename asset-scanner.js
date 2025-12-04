// Asset Scanner Module with API Integrations
// ============================================
// Supports both direct API calls and proxy-based calls (for CORS bypass)

// Initialize cache for scan results
window.SCAN_RESULTS_CACHE = window.SCAN_RESULTS_CACHE || {};

// Proxy Configuration - Set this after deploying Cloudflare Worker
// Example: 'https://vulnfeed-proxy.YOUR-SUBDOMAIN.workers.dev'
const PROXY_URL = '${PROXY_URL}'; // Will be replaced by GitHub Actions if set

// Check if proxy is configured
const isProxyConfigured = () => {
    return PROXY_URL && !PROXY_URL.includes('${') && PROXY_URL !== '';
};

// API Configuration - Injected from GitHub Secrets at build time
// These are used for status display (checking if configured)
const API_KEYS = {
    CENSYS_TOKEN: '${CENSYS_API_TOKEN}',
    SHODAN_KEY: '${SHODAN_API_KEY}',
    ABUSEIPDB_KEY: '${ABUSEIPDB_API_KEY}',
    VT_KEY: '${VT_API_KEY}'
};

// Check if an API key is configured
const isKeyConfigured = (key) => {
    return key && !key.includes('${') && key !== '' && key !== 'undefined';
};

// =====================================================
// PROXY-BASED SCANNING (Recommended - No CORS issues)
// =====================================================

async function scanWithProxy(target) {
    if (!isProxyConfigured()) {
        return {
            target: target,
            type: /^(\d{1,3}\.){3}\d{1,3}$/.test(target) ? 'IP Address' : 'Domain',
            timestamp: new Date().toISOString(),
            scans: [{
                source: 'Proxy',
                success: false,
                error: 'Proxy URL not configured. Set PROXY_URL in GitHub Secrets.'
            }],
            proxyError: true
        };
    }

    try {
        const response = await fetch(`${PROXY_URL}/api/scan-all?target=${encodeURIComponent(target)}`);

        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return {
            target: target,
            type: /^(\d{1,3}\.){3}\d{1,3}$/.test(target) ? 'IP Address' : 'Domain',
            timestamp: new Date().toISOString(),
            scans: [{
                source: 'Proxy',
                success: false,
                error: error.message
            }],
            proxyError: true
        };
    }
}

// =====================================================
// DIRECT API CALLS (Will fail due to CORS in browsers)
// =====================================================

async function scanWithCensys(target) {
    if (!isKeyConfigured(API_KEYS.CENSYS_TOKEN)) {
        return { source: 'Censys', success: false, error: 'API key not configured' };
    }

    try {
        const response = await fetch(`https://search.censys.io/api/v2/hosts/${target}`, {
            headers: {
                'Authorization': `Basic ${btoa(API_KEYS.CENSYS_TOKEN + ':')}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Censys API error: ${response.status}`);
        }

        const data = await response.json();
        return { source: 'Censys', success: true, data: data };
    } catch (error) {
        return { source: 'Censys', success: false, error: error.message };
    }
}

async function scanWithShodan(target) {
    if (!isKeyConfigured(API_KEYS.SHODAN_KEY)) {
        return { source: 'Shodan', success: false, error: 'API key not configured' };
    }

    try {
        const response = await fetch(`https://api.shodan.io/shodan/host/${target}?key=${API_KEYS.SHODAN_KEY}`);

        if (!response.ok) {
            throw new Error(`Shodan API error: ${response.status}`);
        }

        const data = await response.json();
        return { source: 'Shodan', success: true, data: data };
    } catch (error) {
        return { source: 'Shodan', success: false, error: error.message };
    }
}

async function scanWithAbuseIPDB(target) {
    if (!isKeyConfigured(API_KEYS.ABUSEIPDB_KEY)) {
        return { source: 'AbuseIPDB', success: false, error: 'API key not configured' };
    }

    try {
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${target}`, {
            headers: {
                'Key': API_KEYS.ABUSEIPDB_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`AbuseIPDB API error: ${response.status}`);
        }

        const data = await response.json();
        return { source: 'AbuseIPDB', success: true, data: data.data };
    } catch (error) {
        return { source: 'AbuseIPDB', success: false, error: error.message };
    }
}

async function scanWithVirusTotal(target) {
    if (!isKeyConfigured(API_KEYS.VT_KEY)) {
        return { source: 'VirusTotal', success: false, error: 'API key not configured' };
    }

    try {
        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
        const endpoint = isIP ? 'ip_addresses' : 'domains';

        const response = await fetch(`https://www.virustotal.com/api/v3/${endpoint}/${target}`, {
            headers: {
                'x-apikey': API_KEYS.VT_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`VirusTotal API error: ${response.status}`);
        }

        const data = await response.json();
        return { source: 'VirusTotal', success: true, data: data.data };
    } catch (error) {
        return { source: 'VirusTotal', success: false, error: error.message };
    }
}

// =====================================================
// MAIN SCAN FUNCTION
// =====================================================

async function performAssetScan(target) {
    // Try proxy first (recommended for browser use)
    if (isProxyConfigured()) {
        console.log('🔄 Using proxy for API calls...');
        return await scanWithProxy(target);
    }

    // Fallback to direct API calls (will likely fail due to CORS)
    console.log('⚠️ Proxy not configured, attempting direct API calls...');

    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const results = {
        target: target,
        type: isIP ? 'IP Address' : 'Domain',
        timestamp: new Date().toISOString(),
        scans: []
    };

    const scanPromises = [
        scanWithAbuseIPDB(target),
        scanWithVirusTotal(target)
    ];

    if (isIP) {
        scanPromises.push(scanWithShodan(target));
        scanPromises.push(scanWithCensys(target));
    }

    results.scans = await Promise.all(scanPromises);

    // Check if all failed due to CORS
    const allFailed = results.scans.every(s => !s.success);
    if (allFailed) {
        results.corsBlocked = true;
    }

    return results;
}

// =====================================================
// RENDER SCAN RESULTS
// =====================================================

function renderScanResults(results) {
    // Check for proxy/CORS errors
    if (results.proxyError || results.corsBlocked) {
        return `
            <div class="result-card" style="border-left: 3px solid var(--warning);">
                <div class="result-header">⚠️ API Connection Issue</div>
                <div class="result-item">
                    <span>Target</span>
                    <span class="tag">${results.target}</span>
                </div>
                <div class="result-item">
                    <span>Problem</span>
                    <span style="color: var(--warning);">CORS policy blocks direct API calls from browsers</span>
                </div>
                <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: 12px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 1rem;">🔧 How to Fix This:</h4>
                    <ol style="color: var(--text-secondary); margin-left: 1.5rem; line-height: 2;">
                        <li><strong>Deploy the Cloudflare Worker</strong> (free):
                            <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                                <li>Go to <a href="https://dash.cloudflare.com" target="_blank" style="color: var(--accent);">Cloudflare Dashboard</a></li>
                                <li>Create a Worker using <code>cloudflare-worker-proxy.js</code></li>
                                <li>Add your API keys as environment variables</li>
                            </ul>
                        </li>
                        <li><strong>Add PROXY_URL to GitHub Secrets</strong>:
                            <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                                <li>Value: <code>https://your-worker.workers.dev</code></li>
                            </ul>
                        </li>
                        <li><strong>Redeploy</strong> - Push changes to trigger GitHub Actions</li>
                    </ol>
                </div>
            </div>
        `;
    }

    let html = `
        <div class="result-card" style="margin-bottom: 1.5rem;">
            <div class="result-header">📊 Scan Results for ${results.target}</div>
            <div class="result-item">
                <span>Target Type</span>
                <span class="tag">${results.type}</span>
            </div>
            <div class="result-item">
                <span>Scan Time</span>
                <span style="color: var(--text-secondary);">${new Date(results.timestamp).toLocaleString()}</span>
            </div>
            <div class="result-item">
                <span>APIs Used</span>
                <span class="tag">${results.scans.length} services</span>
            </div>
        </div>
    `;

    // Render each scan result
    results.scans.forEach(scan => {
        html += renderIndividualScanResult(scan);
    });

    // Store results in cache to avoid HTML attribute breaking
    const scanId = 'scan_' + Date.now();
    window.SCAN_RESULTS_CACHE[scanId] = results;

    // Export buttons using the scanId reference
    html += `
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="exportScanResults('${scanId}', 'json')">
                📥 Export JSON
            </button>
            <button class="btn btn-secondary" onclick="exportScanResults('${scanId}', 'csv')">
                📥 Export CSV
            </button>
            <button class="btn btn-secondary" onclick="copyToClipboard('${scanId}')">
                📋 Copy to Clipboard
            </button>
        </div>
    `;

    return html;
}

function renderIndividualScanResult(scan) {
    if (!scan.success) {
        return `
            <div class="result-card" style="border-left: 3px solid var(--critical);">
                <div class="result-header">❌ ${scan.source}</div>
                <div class="result-item">
                    <span>Status</span>
                    <span class="tag" style="background: var(--critical); color: white;">Failed</span>
                </div>
                <div class="result-item">
                    <span>Error</span>
                    <span style="color: var(--critical);">${scan.error}</span>
                </div>
            </div>
        `;
    }

    let html = `
        <div class="result-card" style="border-left: 3px solid var(--success);">
            <div class="result-header">✅ ${scan.source}</div>
            <div class="result-item">
                <span>Status</span>
                <span class="tag" style="background: var(--success); color: white;">Success</span>
            </div>
    `;

    // Render source-specific data
    if (scan.source === 'AbuseIPDB' && scan.data) {
        const score = scan.data.abuseConfidenceScore || 0;
        html += `
            <div class="result-item">
                <span>Abuse Confidence</span>
                <span class="tag ${score > 50 ? 'severity-critical' : score > 20 ? 'severity-medium' : 'severity-low'}">
                    ${score}%
                </span>
            </div>
            <div class="result-item">
                <span>Total Reports</span>
                <span>${scan.data.totalReports || 0}</span>
            </div>
            <div class="result-item">
                <span>Country</span>
                <span>${scan.data.countryCode || 'Unknown'}</span>
            </div>
            <div class="result-item">
                <span>ISP</span>
                <span style="color: var(--text-secondary);">${scan.data.isp || 'Unknown'}</span>
            </div>
            <div class="result-item">
                <span>Usage Type</span>
                <span style="color: var(--text-secondary);">${scan.data.usageType || 'Unknown'}</span>
            </div>
        `;
    }

    if (scan.source === 'VirusTotal' && scan.data) {
        const stats = scan.data.attributes?.last_analysis_stats || {};
        const malicious = stats.malicious || 0;
        const suspicious = stats.suspicious || 0;
        const total = Object.values(stats).reduce((a, b) => a + b, 0);

        html += `
            <div class="result-item">
                <span>Detection Rate</span>
                <span class="tag ${malicious > 0 ? 'severity-critical' : 'severity-low'}">
                    ${malicious + suspicious}/${total}
                </span>
            </div>
            <div class="result-item">
                <span>Malicious</span>
                <span class="tag ${malicious > 0 ? 'severity-critical' : 'severity-low'}">${malicious}</span>
            </div>
            <div class="result-item">
                <span>Suspicious</span>
                <span class="tag ${suspicious > 0 ? 'severity-medium' : 'severity-low'}">${suspicious}</span>
            </div>
            <div class="result-item">
                <span>Harmless</span>
                <span>${stats.harmless || 0}</span>
            </div>
            <div class="result-item">
                <span>Reputation</span>
                <span>${scan.data.attributes?.reputation || 0}</span>
            </div>
        `;
    }

    if (scan.source === 'Shodan' && scan.data) {
        const vulns = scan.data.vulns ? Object.keys(scan.data.vulns).length : 0;
        html += `
            <div class="result-item">
                <span>Open Ports</span>
                <span class="tag">${scan.data.ports?.length || 0} ports</span>
            </div>
            <div class="result-item">
                <span>Services</span>
                <span style="color: var(--text-secondary);">${scan.data.ports?.join(', ') || 'None'}</span>
            </div>
            <div class="result-item">
                <span>Organization</span>
                <span>${scan.data.org || 'Unknown'}</span>
            </div>
            <div class="result-item">
                <span>Country</span>
                <span>${scan.data.country_name || 'Unknown'}</span>
            </div>
            <div class="result-item">
                <span>Vulnerabilities</span>
                <span class="tag ${vulns > 0 ? 'severity-critical' : 'severity-low'}">${vulns} CVEs</span>
            </div>
        `;

        // Add Service Details (Banners & Extended Info)
        if (scan.data.data && scan.data.data.length > 0) {
            html += `<div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 0.95rem;">Service Details</h4>`;

            // Sort by port
            const services = [...scan.data.data].sort((a, b) => a.port - b.port);

            services.forEach(service => {
                // FIX: Detect and parse corrupted service.data (which might contain the rest of the JSON object)
                if (typeof service.data === 'string' && service.data.includes('","')) {
                    const knownFields = ['html_hash', 'location', 'components', 'server', 'sitemap', 'os', 'timestamp', 'isp', 'transport', 'asn', 'hostnames', 'ip', 'domains', 'org', 'ssl', 'cipher'];
                    for (const field of knownFields) {
                        const pattern = `","${field}":`;
                        const index = service.data.lastIndexOf(pattern);
                        if (index !== -1) {
                            const bannerPart = service.data.substring(0, index);
                            // Reconstruct valid JSON for the tail
                            const jsonPart = '{"dummy":"' + service.data.substring(index);
                            try {
                                const parsed = JSON.parse(jsonPart);
                                delete parsed.dummy;
                                Object.assign(service, parsed); // Merge parsed props into service
                                service.data = bannerPart; // Clean the banner
                                break;
                            } catch (e) {
                                console.warn('Failed to parse corrupted Shodan data', e);
                            }
                        }
                    }
                }

                const banner = service.data ? service.data.trim() : '';

                // Helper to render a section if data exists
                const renderSection = (title, content) => {
                    if (!content) return '';
                    return `
                        <div style="margin-top: 0.75rem; border-top: 1px solid var(--border); padding-top: 0.5rem;">
                            <div style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 0.25rem;">${title}</div>
                            ${content}
                        </div>
                    `;
                };

                // SSL Info
                let sslHtml = '';
                if (service.ssl) {
                    const cert = service.ssl.cert || {};
                    const issuer = cert.issuer || {};
                    const subject = cert.subject || {};
                    sslHtml = `
                        <div style="font-size: 0.85rem; display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem;">
                            <span style="color: var(--text-muted);">Versions:</span>
                            <span>${service.ssl.versions ? service.ssl.versions.join(', ') : 'Unknown'}</span>
                            <span style="color: var(--text-muted);">Expires:</span>
                            <span>${cert.expires || 'Unknown'}</span>
                            <span style="color: var(--text-muted);">Issuer:</span>
                            <span>${issuer.CN || issuer.O || 'Unknown'}</span>
                            <span style="color: var(--text-muted);">Subject:</span>
                            <span>${subject.CN || subject.O || 'Unknown'}</span>
                            ${service.cipher ? `<span style="color: var(--text-muted);">Cipher:</span><span>${service.cipher.name} (${service.cipher.bits} bits)</span>` : ''}
                        </div>
                    `;
                }

                // Components/Tech
                let componentsHtml = '';
                if (service.components) {
                    componentsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">`;
                    for (const [name, details] of Object.entries(service.components)) {
                        componentsHtml += `
                            <span class="tag" style="font-size: 0.75rem; background: var(--bg-primary); border: 1px solid var(--border);">
                                ${name} ${details.categories ? `(${details.categories.join(', ')})` : ''}
                            </span>`;
                    }
                    componentsHtml += `</div>`;
                }

                // Network/Location Info (if different from main)
                let networkHtml = '';
                if (service.location || service.asn || service.isp) {
                    networkHtml = `
                        <div style="font-size: 0.85rem; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 1rem;">
                            ${service.isp ? `<span style="color: var(--text-muted);">ISP:</span><span>${service.isp}</span>` : ''}
                            ${service.asn ? `<span style="color: var(--text-muted);">ASN:</span><span>${service.asn}</span>` : ''}
                            ${service.location ? `<span style="color: var(--text-muted);">Location:</span><span>${[service.location.city, service.location.country_name].filter(Boolean).join(', ')}</span>` : ''}
                        </div>
                    `;
                }

                html += `
                    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; border: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-weight: bold; color: var(--accent); font-size: 1rem;">${service.port}</span>
                                <span class="tag" style="font-size: 0.75rem;">${service.transport.toUpperCase()}</span>
                            </div>
                            <span style="color: var(--text-primary); font-weight: 500;">${service.product || ''} ${service.version || ''}</span>
                        </div>

                        ${renderSection('Banner', banner ? `<pre style="font-size: 0.8rem; color: var(--text-muted); overflow-x: auto; white-space: pre-wrap; margin: 0; background: var(--bg-card); padding: 0.5rem; border-radius: 4px; max-height: 200px;">${banner.substring(0, 500)}${banner.length > 500 ? '...' : ''}</pre>` : '<span style="color: var(--text-muted); font-style: italic;">No banner available</span>')}
                        
                        ${renderSection('SSL/TLS Configuration', sslHtml)}
                        ${renderSection('Detected Components', componentsHtml)}
                        ${renderSection('Network & Location', networkHtml)}
                    </div>
                `;
            });
            html += `</div>`;
        }
    }

    if (scan.source === 'Censys' && scan.data) {
        const services = scan.data.result?.services || [];
        html += `
            <div class="result-item">
                <span>Services Found</span>
                <span class="tag">${services.length} services</span>
            </div>
            <div class="result-item">
                <span>Location</span>
                <span>${scan.data.result?.location?.country || 'Unknown'}</span>
            </div>
            <div class="result-item">
                <span>Autonomous System</span>
                <span style="color: var(--text-secondary);">${scan.data.result?.autonomous_system?.name || 'Unknown'}</span>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// =====================================================
// EXPORT FUNCTIONS
// =====================================================

function exportScanResults(scanIdOrData, format) {
    let results;

    // Check if input is an ID string or direct data object
    if (typeof scanIdOrData === 'string') {
        if (window.SCAN_RESULTS_CACHE && window.SCAN_RESULTS_CACHE[scanIdOrData]) {
            results = window.SCAN_RESULTS_CACHE[scanIdOrData];
        } else {
            // Try parsing as JSON if it's not a cache ID (legacy fallback)
            try {
                results = JSON.parse(scanIdOrData);
            } catch (e) {
                console.error('Invalid scan results data');
                return;
            }
        }
    } else {
        results = scanIdOrData;
    }

    if (format === 'json') {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `asset-scan-${results.target}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {
        let csv = 'Source,Status,Details\n';
        results.scans.forEach(scan => {
            const details = scan.success ? JSON.stringify(scan.data).substring(0, 100) : scan.error;
            csv += `${scan.source},${scan.success ? 'Success' : 'Failed'},"${details}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `asset-scan-${results.target}-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function copyToClipboard(scanIdOrData) {
    let results;

    if (typeof scanIdOrData === 'string') {
        if (window.SCAN_RESULTS_CACHE && window.SCAN_RESULTS_CACHE[scanIdOrData]) {
            results = window.SCAN_RESULTS_CACHE[scanIdOrData];
        } else {
            try {
                results = JSON.parse(scanIdOrData);
            } catch (e) {
                console.error('Invalid scan results data');
                return;
            }
        }
    } else {
        results = scanIdOrData;
    }

    navigator.clipboard.writeText(JSON.stringify(results, null, 2))
        .then(() => alert('✅ Results copied to clipboard!'))
        .catch(err => alert('❌ Failed to copy: ' + err));
}
