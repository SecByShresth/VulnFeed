// Onyx Vuln Intelligence Dashboard - Main Application
// =====================================================

// Data Sources Configuration
const DATA_SOURCES = {
    // Government & Security Agencies
    'cisa-kev': { name: 'CISA KEV', icon: '🇺🇸', category: 'government' },

    // Enterprise Linux
    'redhat-cves': { name: 'Red Hat', icon: '🎩', category: 'linux' },
    'almalinux': { name: 'AlmaLinux', icon: '🐧', category: 'linux' },
    'rocky': { name: 'Rocky Linux', icon: '⛰️', category: 'linux' },
    'debian': { name: 'Debian', icon: '🌀', category: 'linux' },
    'ubuntu': { name: 'Ubuntu', icon: '🟠', category: 'linux' },
    'suse': { name: 'SUSE', icon: '🦎', category: 'linux' },

    // Additional OSV Ecosystems (to be added)
    'alpine': { name: 'Alpine Linux', icon: '🏔️', category: 'linux' },
    'amazon': { name: 'Amazon Linux', icon: '📦', category: 'linux' },
    'arch': { name: 'Arch Linux', icon: '🏛️', category: 'linux' },
    'fedora': { name: 'Fedora', icon: '🎩', category: 'linux' },
    'oracle': { name: 'Oracle Linux', icon: '🔴', category: 'linux' },

    // Databases
    'mysql': { name: 'MySQL', icon: '🐬', category: 'database' },
    'postgresql': { name: 'PostgreSQL', icon: '🐘', category: 'database' },
    'redis': { name: 'Redis', icon: '🔴', category: 'database' },
    'mongodb': { name: 'MongoDB', icon: '🍃', category: 'database' },

    // Programming Languages & Ecosystems
    'npm': { name: 'npm (Node.js)', icon: '📦', category: 'package' },
    'pypi': { name: 'PyPI (Python)', icon: '🐍', category: 'package' },
    'maven': { name: 'Maven (Java)', icon: '☕', category: 'package' },
    'nuget': { name: 'NuGet (.NET)', icon: '💎', category: 'package' },
    'rubygems': { name: 'RubyGems', icon: '💎', category: 'package' },
    'go': { name: 'Go Modules', icon: '🐹', category: 'package' },
    'cargo': { name: 'Cargo (Rust)', icon: '🦀', category: 'package' },
    'composer': { name: 'Composer (PHP)', icon: '🎼', category: 'package' },
};

// Global State
let allData = {};
let currentTab = 'dashboard';
let currentPage = 1;
let itemsPerPage = 50;
let filteredData = [];
let charts = {};

// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button text
    document.getElementById('themeIcon').textContent = newTheme === 'light' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = newTheme === 'light' ? 'Dark' : 'Light';

    // Update charts if they exist
    updateChartThemes();
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeIcon').textContent = savedTheme === 'light' ? '🌙' : '☀️';
    document.getElementById('themeText').textContent = savedTheme === 'light' ? 'Dark' : 'Light';
}

// Data Loading
async function loadData() {
    const results = {};
    const loadPromises = [];

    for (const [key, source] of Object.entries(DATA_SOURCES)) {
        loadPromises.push(
            fetch(`data/${key}.json`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                })
                .then(data => {
                    if (data) {
                        results[key] = data;
                    }
                })
                .catch(error => {
                    console.warn(`Failed to load ${key}:`, error);
                })
        );
    }

    await Promise.all(loadPromises);
    return results;
}

// Vulnerability Normalization
function normalizeVulnerability(vuln, source) {
    // CISA KEV format
    if (source === 'cisa-kev') {
        return {
            id: vuln.cveID,
            title: vuln.vulnerabilityName,
            description: vuln.shortDescription,
            severity: vuln.knownRansomwareCampaignUse === 'Known' ? 'critical' : 'high',
            date: vuln.dateAdded,
            vendor: vuln.vendorProject,
            product: vuln.product,
            dueDate: vuln.dueDate,
            cvss: null,
            references: vuln.notes ? [vuln.notes] : [],
            source: source,
            ransomware: vuln.knownRansomwareCampaignUse
        };
    }

    // Red Hat format
    if (source === 'redhat-cves') {
        return {
            id: vuln.CVE,
            title: vuln.bugzilla_description || vuln.CVE,
            description: vuln.bugzilla_description || 'No description available',
            severity: vuln.severity || 'unknown',
            date: vuln.public_date,
            cvss: vuln.cvss3_score || vuln.cvss_score,
            cvssVector: vuln.cvss3_scoring_vector || vuln.cvss_scoring_vector,
            cwe: vuln.CWE,
            bugzilla: vuln.bugzilla,
            affectedPackages: vuln.affected_packages,
            references: [vuln.resource_url],
            source: source
        };
    }

    // OSV format (Linux distros, databases, packages)
    return {
        id: vuln.id,
        title: vuln.summary || vuln.id,
        description: vuln.details || vuln.summary || 'No description available',
        severity: vuln.database_specific?.severity || vuln.severity || 'unknown',
        date: vuln.published,
        modified: vuln.modified,
        aliases: vuln.aliases || [],
        affected: vuln.affected || [],
        references: vuln.references || [],
        source: source,
        cvss: vuln.database_specific?.cvss_score || null
    };
}

// Severity Classification
function getSeverityClass(severity) {
    if (!severity) return 'severity-unknown';
    const s = String(severity).toLowerCase();
    if (s.includes('critical')) return 'severity-critical';
    if (s.includes('important') || s.includes('high')) return 'severity-important';
    if (s.includes('moderate') || s.includes('medium')) return 'severity-moderate';
    if (s.includes('low')) return 'severity-low';
    return 'severity-unknown';
}

// Date Formatting
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'N/A';
    }
}

function getRelativeTime(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
        return 'N/A';
    }
}

// Render Vulnerability Card
const vulnDataStore = new Map(); // Store vulnerability data

function renderVulnerabilityCard(vuln) {
    // Generate unique ID for this vulnerability
    const vulnId = `vuln-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    vulnDataStore.set(vulnId, vuln);

    return `
        <div class="vuln-card" data-vuln-id="${vulnId}" onclick="showModalById('${vulnId}')">
            <div class="vuln-header">
                <div class="vuln-id">${vuln.id}</div>
                <span class="severity-badge ${getSeverityClass(vuln.severity)}">
                    ${vuln.severity || 'Unknown'}
                </span>
            </div>
            <div class="vuln-description">${vuln.title || vuln.description}</div>
            <div class="vuln-meta">
                <div class="meta-item">📅 ${formatDate(vuln.date)}</div>
                ${vuln.cvss ? `<div class="meta-item">⚠️ CVSS: ${vuln.cvss}</div>` : ''}
                ${vuln.vendor ? `<div class="meta-item">🏢 ${vuln.vendor}</div>` : ''}
                <div class="meta-item">📦 ${DATA_SOURCES[vuln.source]?.name || vuln.source}</div>
            </div>
        </div>
    `;
}

// Dashboard Rendering
function renderDashboard() {
    let totalVulns = 0;
    let criticalCount = 0;
    let latestFetchDate = null;
    let ecosystemCount = 0;

    const severityDistribution = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        unknown: 0
    };

    const sourceDistribution = {};

    for (const [source, data] of Object.entries(allData)) {
        ecosystemCount++;
        const vulns = source === 'cisa-kev' ? data.vulnerabilities : data;

        if (Array.isArray(vulns)) {
            totalVulns += vulns.length;
            sourceDistribution[source] = vulns.length;

            vulns.forEach(v => {
                const normalized = normalizeVulnerability(v, source);
                const sevValue = String(normalized.severity || '').toLowerCase();

                // Count by severity
                if (sevValue.includes('critical')) {
                    criticalCount++;
                    severityDistribution.critical++;
                } else if (sevValue.includes('important') || sevValue.includes('high')) {
                    criticalCount++;
                    severityDistribution.high++;
                } else if (sevValue.includes('moderate') || sevValue.includes('medium')) {
                    severityDistribution.medium++;
                } else if (sevValue.includes('low')) {
                    severityDistribution.low++;
                } else {
                    severityDistribution.unknown++;
                }

                // Track latest update
                const fetchedAt = v._metadata?.fetched_at || v.fetched_at;
                if (fetchedAt) {
                    const fetchDate = new Date(fetchedAt);
                    if (!latestFetchDate || fetchDate > latestFetchDate) {
                        latestFetchDate = fetchDate;
                    }
                }
            });
        }

        // Check CISA KEV metadata
        if (source === 'cisa-kev' && data.dateReleased) {
            const releaseDate = new Date(data.dateReleased);
            if (!latestFetchDate || releaseDate > latestFetchDate) {
                latestFetchDate = releaseDate;
            }
        }
    }

    // Update stats
    document.getElementById('totalVulns').textContent = totalVulns.toLocaleString();
    document.getElementById('criticalCount').textContent = criticalCount.toLocaleString();
    document.getElementById('dataSources').textContent = Object.keys(allData).length;
    document.getElementById('ecosystems').textContent = ecosystemCount;
    document.getElementById('lastSyncTime').textContent = latestFetchDate ? formatDate(latestFetchDate) : 'N/A';

    // Render charts and source cards
    let html = '<div class="charts-grid">';

    // Severity Distribution Chart
    html += `
        <div class="chart-container">
            <div class="chart-title">Severity Distribution</div>
            <canvas id="severityChart"></canvas>
        </div>
    `;

    // Top Sources Chart
    html += `
        <div class="chart-container">
            <div class="chart-title">Top Vulnerability Sources</div>
            <canvas id="sourcesChart"></canvas>
        </div>
    `;

    html += '</div>';

    // Source Cards
    html += '<div class="vuln-grid">';

    for (const [source, info] of Object.entries(DATA_SOURCES)) {
        if (!allData[source]) continue;

        const data = allData[source];
        const vulns = source === 'cisa-kev' ? data.vulnerabilities : data;
        const count = Array.isArray(vulns) ? vulns.length : 0;

        html += `
            <div class="vuln-card" onclick="switchTab('${source}')">
                <div class="vuln-header">
                    <div class="vuln-id">${info.icon} ${info.name}</div>
                    <span class="severity-badge severity-unknown">${count} vulns</span>
                </div>
                <div class="vuln-description">Click to view ${info.name} vulnerabilities</div>
                <div class="vuln-meta">
                    <div class="meta-item">📂 ${info.category}</div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    document.getElementById('content').innerHTML = html;

    // Render charts
    renderSeverityChart(severityDistribution);
    renderSourcesChart(sourceDistribution);
}

// Chart Rendering Functions
function renderSeverityChart(data) {
    const ctx = document.getElementById('severityChart');
    if (!ctx) return;

    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#cbd5e1' : '#64748b';

    if (charts.severity) {
        charts.severity.destroy();
    }

    charts.severity = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Unknown'],
            datasets: [{
                data: [data.critical, data.high, data.medium, data.low, data.unknown],
                backgroundColor: [
                    '#dc2626',
                    '#ea580c',
                    '#ca8a04',
                    '#16a34a',
                    '#64748b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

function renderSourcesChart(data) {
    const ctx = document.getElementById('sourcesChart');
    if (!ctx) return;

    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#cbd5e1' : '#64748b';

    // Get top 10 sources
    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const labels = sorted.map(([key]) => DATA_SOURCES[key]?.name || key);
    const values = sorted.map(([, value]) => value);

    if (charts.sources) {
        charts.sources.destroy();
    }

    charts.sources = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vulnerabilities',
                data: values,
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        color: theme === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)'
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateChartThemes() {
    if (charts.severity) {
        renderSeverityChart(charts.severity.data.datasets[0].data);
    }
    if (charts.sources) {
        const data = {};
        charts.sources.data.labels.forEach((label, i) => {
            const key = Object.keys(DATA_SOURCES).find(k => DATA_SOURCES[k].name === label);
            if (key) data[key] = charts.sources.data.datasets[0].data[i];
        });
        renderSourcesChart(data);
    }
}

// Source Rendering
function renderSource(source) {
    if (!allData[source]) {
        document.getElementById('content').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No data available for this source</p>
            </div>
        `;
        return;
    }

    const data = allData[source];
    let vulns = source === 'cisa-kev' ? data.vulnerabilities : data;

    if (!Array.isArray(vulns) || vulns.length === 0) {
        document.getElementById('content').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>No vulnerabilities found</p>
            </div>
        `;
        return;
    }

    // Normalize all vulnerabilities
    filteredData = vulns.map(v => normalizeVulnerability(v, source));

    // Apply filters
    applyFilters();
}

// Filtering
function applyFilters() {
    if (currentTab === 'dashboard' || currentTab === 'asset-scanner') return;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const severityFilter = document.getElementById('severityFilter').value.toLowerCase();
    const timeFilter = parseInt(document.getElementById('timeFilter').value) || 0;

    let filtered = [...filteredData];

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(v =>
            v.id.toLowerCase().includes(searchTerm) ||
            v.title.toLowerCase().includes(searchTerm) ||
            v.description.toLowerCase().includes(searchTerm)
        );
    }

    // Severity filter
    if (severityFilter) {
        filtered = filtered.filter(v =>
            String(v.severity || '').toLowerCase().includes(severityFilter)
        );
    }

    // Time filter
    if (timeFilter > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeFilter);

        filtered = filtered.filter(v => {
            if (!v.date) return false;
            const vulnDate = new Date(v.date);
            return vulnDate >= cutoffDate;
        });
    }

    // Render filtered results
    renderFilteredResults(filtered);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('severityFilter').value = '';
    document.getElementById('timeFilter').value = '';
    applyFilters();
}

function renderFilteredResults(vulns) {
    currentPage = 1;
    const totalPages = Math.ceil(vulns.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageVulns = vulns.slice(start, end);

    let html = `<div class="vuln-grid">`;

    if (pageVulns.length === 0) {
        html = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>No vulnerabilities match your filters</p>
            </div>
        `;
    } else {
        pageVulns.forEach(vuln => {
            html += renderVulnerabilityCard(vuln);
        });
        html += '</div>';

        // Add pagination
        if (totalPages > 1) {
            html += renderPagination(currentPage, totalPages, vulns);
        }
    }

    document.getElementById('content').innerHTML = html;
}

function renderPagination(current, total, data) {
    let html = '<div class="pagination">';

    html += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="changePage(${current - 1}, ${JSON.stringify(data).replace(/"/g, '&quot;')})">← Prev</button>`;

    for (let i = 1; i <= Math.min(total, 10); i++) {
        html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="changePage(${i}, ${JSON.stringify(data).replace(/"/g, '&quot;')})">${i}</button>`;
    }

    if (total > 10) {
        html += `<span class="page-btn" disabled>...</span>`;
    }

    html += `<button class="page-btn" ${current === total ? 'disabled' : ''} onclick="changePage(${current + 1}, ${JSON.stringify(data).replace(/"/g, '&quot;')})">Next →</button>`;

    html += '</div>';
    return html;
}

function changePage(page, data) {
    currentPage = page;
    renderFilteredResults(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Functions
function showModal(vuln) {
    document.getElementById('modalTitle').textContent = vuln.id;
    document.getElementById('modalBadges').innerHTML = `
        <span class="severity-badge ${getSeverityClass(vuln.severity)}">${vuln.severity || 'Unknown'}</span>
        <span class="tag">${DATA_SOURCES[vuln.source]?.icon || ''} ${DATA_SOURCES[vuln.source]?.name || vuln.source}</span>
    `;

    let body = `
        <div class="detail-section">
            <div class="detail-label">Title</div>
            <div class="detail-value"><strong>${vuln.title}</strong></div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Description</div>
            <div class="detail-value">${vuln.description}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Published Date</div>
            <div class="detail-value">${formatDate(vuln.date)} (${getRelativeTime(vuln.date)})</div>
        </div>
    `;

    if (vuln.modified) {
        body += `
            <div class="detail-section">
                <div class="detail-label">Last Modified</div>
                <div class="detail-value">${formatDate(vuln.modified)} (${getRelativeTime(vuln.modified)})</div>
            </div>
        `;
    }

    if (vuln.cvss) {
        body += `
            <div class="detail-section">
                <div class="detail-label">CVSS Score</div>
                <div class="detail-value">${vuln.cvss} ${vuln.cvssVector ? `<br><code>${vuln.cvssVector}</code>` : ''}</div>
            </div>
        `;
    }

    if (vuln.cwe) {
        body += `
            <div class="detail-section">
                <div class="detail-label">CWE</div>
                <div class="detail-value">${vuln.cwe}</div>
            </div>
        `;
    }

    if (vuln.aliases && vuln.aliases.length > 0) {
        body += `
            <div class="detail-section">
                <div class="detail-label">Aliases</div>
                <div class="detail-value">
                    ${vuln.aliases.map(a => `<span class="tag">${a}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (vuln.affectedPackages && vuln.affectedPackages.length > 0) {
        body += `
            <div class="detail-section">
                <div class="detail-label">Affected Packages</div>
                <div class="detail-value">
                    ${vuln.affectedPackages.map(p => `<span class="tag">${p}</span>`).join('')}
                </div>
            </div>
        `;
    }

    if (vuln.references && vuln.references.length > 0) {
        const refs = Array.isArray(vuln.references) ? vuln.references : [vuln.references];
        body += `
            <div class="detail-section">
                <div class="detail-label">References</div>
                <div class="detail-value">
                    ${refs.map(ref => {
            const url = typeof ref === 'string' ? ref : ref.url;
            if (url) {
                return `<a href="${url}" target="_blank" class="link-button">View Reference →</a>`;
            }
            return '';
        }).join('')}
                </div>
            </div>
        `;
    }

    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Helper function to show modal by ID
function showModalById(vulnId) {
    const vuln = vulnDataStore.get(vulnId);
    if (vuln) {
        showModal(vuln);
    }
}

// Tab Switching
function switchTab(tab) {
    currentTab = tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');

    // Show/hide filter bar
    const filterBar = document.getElementById('filterBar');
    if (tab === 'dashboard' || tab === 'asset-scanner') {
        filterBar.style.display = 'none';
    } else {
        filterBar.style.display = 'flex';
    }

    if (tab === 'dashboard') {
        renderDashboard();
    } else if (tab === 'asset-scanner') {
        renderAssetScanner();
    } else {
        renderSource(tab);
    }
}

// Asset Scanner
function renderAssetScanner() {
    const html = `
        <div class="scanner-container">
            <h2 style="margin-bottom: 1.5rem; color: var(--text-primary);">🌐 Asset Exposure Scanner</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Scan IP addresses or domains for exposed services and security risks. 
                <strong>Note:</strong> API integration required for full functionality.
            </p>
            
            <div class="scanner-input-group">
                <input type="text" id="assetInput" class="scanner-input" placeholder="Enter IP address or domain (e.g., 8.8.8.8 or example.com)">
                <button class="btn btn-primary" onclick="scanAsset()">
                    🔍 Scan Asset
                </button>
            </div>
            
            <div id="scannerResults"></div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border);">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">⚙️ API Configuration</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                    To enable asset scanning, configure API keys in GitHub Secrets:
                </p>
                <ul style="color: var(--text-secondary); margin-left: 1.5rem;">
                    <li><strong>CENSYS_API_ID</strong> and <strong>CENSYS_API_SECRET</strong> - For Censys Search API</li>
                    <li><strong>SHODAN_API_KEY</strong> - For Shodan API (alternative)</li>
                </ul>
                <p style="color: var(--text-muted); margin-top: 1rem; font-size: 0.875rem;">
                    API keys are injected at build time and never exposed in the frontend code.
                </p>
            </div>
        </div>
    `;

    document.getElementById('content').innerHTML = html;
}

function scanAsset() {
    const input = document.getElementById('assetInput').value.trim();
    const resultsDiv = document.getElementById('scannerResults');

    if (!input) {
        resultsDiv.innerHTML = '<div class="error">Please enter an IP address or domain</div>';
        return;
    }

    // Validate input
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;

    if (!ipRegex.test(input) && !domainRegex.test(input)) {
        resultsDiv.innerHTML = '<div class="error">Invalid IP address or domain format</div>';
        return;
    }

    resultsDiv.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Scanning ${input}...</p>
        </div>
    `;

    // Simulate scan (replace with actual API calls)
    setTimeout(() => {
        resultsDiv.innerHTML = `
            <div class="result-card">
                <div class="result-header">📊 Scan Results for ${input}</div>
                <div class="result-item">
                    <span>Status</span>
                    <span class="tag">⚠️ API Not Configured</span>
                </div>
                <div class="result-item">
                    <span>Message</span>
                    <span style="color: var(--text-secondary);">Configure API keys in GitHub Secrets to enable scanning</span>
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="exportScanResults()">📥 Export Results (JSON)</button>
                <button class="btn btn-secondary" onclick="exportScanResults('csv')" style="margin-left: 0.5rem;">📥 Export Results (CSV)</button>
            </div>
        `;
    }, 2000);
}

function exportScanResults(format = 'json') {
    alert(`Export functionality will be implemented with actual scan data. Format: ${format.toUpperCase()}`);
}

// Tabs Rendering
function renderTabs() {
    let html = '<div class="tab active" data-tab="dashboard" onclick="switchTab(\'dashboard\')">📊 Dashboard</div>';

    for (const [key, source] of Object.entries(DATA_SOURCES)) {
        if (allData[key]) {
            html += `<div class="tab" data-tab="${key}" onclick="switchTab('${key}')">${source.icon} ${source.name}</div>`;
        }
    }

    document.getElementById('tabs').innerHTML = html;
}

// Event Listeners
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeAssetScannerModal();
    }
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
    }
});

// =====================================================
// ASSET SCANNER MODAL FUNCTIONS
// =====================================================

// Open Asset Scanner Modal
function openAssetScannerModal() {
    document.getElementById('scannerModal').classList.add('active');
    document.getElementById('modalScannerResults').innerHTML = '';
    checkAPIStatus();

    // Focus on input
    setTimeout(() => {
        document.getElementById('modalAssetInput')?.focus();
    }, 300);
}

// Close Asset Scanner Modal
function closeAssetScannerModal() {
    document.getElementById('scannerModal').classList.remove('active');
}

// Close modal on background click
document.addEventListener('click', (e) => {
    if (e.target.id === 'scannerModal') {
        closeAssetScannerModal();
    }
});

// Check API Status - Pings the Cloudflare Worker to check if APIs are online
async function checkAPIStatus() {
    const PROXY_URL = 'https://vulnfeed-api-proxy.shresthpaul133.workers.dev';

    const apis = [
        { id: 'shodan', name: 'Shodan' },
        { id: 'abuseipdb', name: 'AbuseIPDB' },
        { id: 'virustotal', name: 'VirusTotal' }
    ];

    // First check if proxy is reachable
    try {
        const proxyCheck = await fetch(`${PROXY_URL}/api/scan-all?target=1.1.1.1`, {
            method: 'GET',
            signal: AbortSignal.timeout(10000)
        });

        if (proxyCheck.ok) {
            const results = await proxyCheck.json();

            // Update each API status based on scan results
            results.scans?.forEach(scan => {
                const apiId = scan.source.toLowerCase();
                const element = document.getElementById(`apiStatus-${apiId}`);
                if (!element) return;

                const badge = element.querySelector('.api-badge');
                if (scan.success) {
                    badge.className = 'api-badge api-configured';
                    badge.textContent = 'Online';
                } else {
                    badge.className = 'api-badge api-missing';
                    badge.textContent = 'Error';
                }
            });
        } else {
            // Proxy returned error
            apis.forEach(api => {
                const element = document.getElementById(`apiStatus-${api.id}`);
                if (!element) return;
                const badge = element.querySelector('.api-badge');
                badge.className = 'api-badge api-missing';
                badge.textContent = 'Offline';
            });
        }
    } catch (error) {
        // Proxy unreachable
        console.error('Proxy check failed:', error);
        apis.forEach(api => {
            const element = document.getElementById(`apiStatus-${api.id}`);
            if (!element) return;
            const badge = element.querySelector('.api-badge');
            badge.className = 'api-badge api-missing';
            badge.textContent = 'Offline';
        });
    }
}

// Run scan from modal
async function runScanFromModal() {
    const input = document.getElementById('modalAssetInput').value.trim();
    const resultsDiv = document.getElementById('modalScannerResults');

    if (!input) {
        resultsDiv.innerHTML = '<div class="error">⚠️ Please enter an IP address or domain to scan</div>';
        return;
    }

    // Validate input
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;

    if (!ipRegex.test(input) && !domainRegex.test(input)) {
        resultsDiv.innerHTML = '<div class="error">❌ Invalid IP address or domain format</div>';
        return;
    }

    // Show loading
    resultsDiv.innerHTML = `
        <div class="scan-loading">
            <div class="spinner"></div>
            <p>🔍 Scanning <strong>${input}</strong>...</p>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">
                Querying multiple threat intelligence sources...
            </p>
        </div>
    `;

    try {
        // Check if performAssetScan function exists (from asset-scanner.js)
        if (typeof performAssetScan === 'function') {
            const results = await performAssetScan(input);
            resultsDiv.innerHTML = renderScanResults(results);
        } else {
            // Fallback if API functions not available
            setTimeout(() => {
                resultsDiv.innerHTML = `
                    <div class="result-card" style="border-left: 3px solid var(--warning);">
                        <div class="result-header">⚠️ API Not Configured</div>
                        <div class="result-item">
                            <span>Target</span>
                            <span class="tag">${input}</span>
                        </div>
                        <div class="result-item">
                            <span>Status</span>
                            <span style="color: var(--warning);">API keys not injected</span>
                        </div>
                        <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                                <strong>To enable scanning:</strong>
                            </p>
                            <ol style="color: var(--text-muted); margin-left: 1.5rem; font-size: 0.875rem;">
                                <li>Add API keys to GitHub Secrets</li>
                                <li>Push changes to trigger deployment</li>
                                <li>Wait for GitHub Actions to complete</li>
                            </ol>
                        </div>
                    </div>
                `;
            }, 1500);
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="error">
                <strong>❌ Scan Failed:</strong> ${error.message}
            </div>
        `;
    }
}

// Allow Enter key to trigger scan
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'modalAssetInput') {
        runScanFromModal();
    }
});

// Initialize Application
(async () => {
    try {
        initTheme();
        allData = await loadData();
        renderTabs();
        renderDashboard();
    } catch (error) {
        console.error('Initialization error:', error);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <strong>Failed to load data:</strong> ${error.message}
                <br><br>
                Please check the console for more details.
            </div>
        `;
    }
})();
