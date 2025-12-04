# ⬡ Onyx Vuln Intelligence Dashboard

### **Complete OSV Vulnerability Intelligence & Asset Exposure Platform**

A **premium, zero-server vulnerability intelligence dashboard** that aggregates security advisories from **CISA KEV, Red Hat, major Linux distributions, databases, and package ecosystems** into a stunning, interactive interface with optional asset exposure scanning.

---

## 🎯 What is Onyx Intelligence?

**Onyx** is a next-generation vulnerability intelligence platform that provides:

- ✅ **Complete OSV.dev Integration** - Multi-ecosystem vulnerability data
- ✅ **Asset Exposure Scanning** - IP & domain security assessment (API-enabled)
- ✅ **Premium UI/UX** - Glassmorphism design with light/dark themes
- ✅ **Zero-Server Architecture** - Fully static, GitHub Pages deployment
- ✅ **Automated Updates** - GitHub Actions refresh every 6 hours
- ✅ **Advanced Analytics** - Interactive charts and severity distributions
- ✅ **Smart Filtering** - Search, filter by severity, time ranges
- ✅ **100% Private** - No tracking, no cookies, client-side only

---

## 🌟 Key Features

### 🔍 **Comprehensive Vulnerability Coverage**

#### Government & Security Agencies
- **CISA KEV** - Known Exploited Vulnerabilities (U.S. Cybersecurity)

#### Enterprise Linux Distributions
- **Red Hat Enterprise Linux** - Enterprise security advisories
- **AlmaLinux** - RHEL-compatible distribution
- **Rocky Linux** - Enterprise-grade alternative
- **Debian** - Stable and testing security
- **Ubuntu** - Canonical security updates
- **SUSE Linux** - Enterprise and openSUSE
- **Alpine Linux** - Container-focused security
- **Amazon Linux** - AWS-optimized distribution
- **Arch Linux** - Rolling release security
- **Fedora** - Community-driven updates
- **Oracle Linux** - Enterprise compatibility

#### Databases
- **MySQL** - World's most popular open-source database
- **PostgreSQL** - Advanced open-source database
- **Redis** - In-memory data structure store
- **MongoDB** - NoSQL document database

#### Package Ecosystems
- **npm** - Node.js packages
- **PyPI** - Python packages
- **Maven** - Java/JVM packages
- **NuGet** - .NET packages
- **RubyGems** - Ruby packages
- **Go Modules** - Go packages
- **Cargo** - Rust packages (crates.io)
- **Composer** - PHP packages (Packagist)

### 🎨 **Premium User Interface**

- **Glassmorphism Design** - Modern backdrop blur effects
- **Light/Dark Themes** - Seamless theme switching with localStorage persistence
- **Smooth Animations** - Micro-interactions and hover effects
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Interactive Charts** - Chart.js visualizations for severity and source distribution
- **Advanced Search** - Real-time filtering across CVE IDs, packages, descriptions
- **Pagination** - Efficient browsing of large datasets

### 🌐 **Asset Exposure Scanner** (Optional)

Scan IP addresses and domains for:
- **Exposed Services** - Port scanning and service detection
- **Certificate Enumeration** - SSL/TLS certificate analysis
- **Risk Scoring** - Automated security risk assessment
- **Export Capabilities** - JSON and CSV export

**Supported APIs:**
- **Censys Search API** - Primary option (free tier available)
- **Shodan API** - Alternative option (free tier available)

**Security:** API keys stored as GitHub Secrets, injected at build time, never exposed in frontend.

---

## 🚀 Quick Start

### 🔗 **Live Demo**

👉 **[View Live Dashboard](https://yourusername.github.io/VulnFeed/)**

No installation required - just open and explore!

### 🧰 **Self-Hosted Deployment**

#### 1️⃣ Fork the Repository
Click the **Fork** button at the top of this page.

#### 2️⃣ Enable GitHub Actions
- Go to **Settings** → **Actions** → **General**
- Set **Workflow permissions** to **"Read and write permissions"**
- Check **"Allow GitHub Actions to create and approve pull requests"**

#### 3️⃣ Enable GitHub Pages
- Go to **Settings** → **Pages**
- Set **Source** to **"GitHub Actions"**

#### 4️⃣ Configure API Keys (Optional - for Asset Scanner)
- Go to **Settings** → **Secrets and variables** → **Actions**
- Add the following secrets:
  - `CENSYS_API_ID` - Your Censys API ID
  - `CENSYS_API_SECRET` - Your Censys API Secret
  - `SHODAN_API_KEY` - Your Shodan API Key (alternative)

#### 5️⃣ Trigger Initial Data Fetch
- Go to **Actions** → **"🔄 Onyx OSV Intelligence Feed"**
- Click **"Run workflow"** → **"Run workflow"**

#### 6️⃣ Access Your Dashboard
- Visit `https://yourusername.github.io/repository-name/`

---

## 📊 Data Sources & Update Frequency

### Automated Updates
- **Schedule:** Every **6 hours** (configurable in `.github/workflows/osv-feed-update.yml`)
- **Manual Trigger:** Available via GitHub Actions workflow dispatch
- **Data Freshness:** Typically less than 6 hours old

### Data Sources
All data is fetched from authoritative sources:
- **OSV.dev** - Open Source Vulnerabilities database
- **CISA** - Known Exploited Vulnerabilities catalog
- **Red Hat Security** - Enterprise security advisories
- **Linux Distribution Security Teams** - Official security feeds

---

## 🎨 UI Features & Design

### Theme System
- **Light Mode** - Clean, professional white theme (default)
- **Dark Mode** - Sleek, modern dark theme
- **Auto-persistence** - Theme preference saved in localStorage
- **Smooth transitions** - Animated theme switching

### Visual Design Elements
- **Gradient Backgrounds** - Dynamic color gradients
- **Glassmorphism Cards** - Backdrop blur with transparency
- **Micro-animations** - Hover effects and transitions
- **Color-coded Severity** - Instant visual threat assessment
- **Responsive Grid** - Adaptive layouts for all screen sizes

### Interactive Features
- **Real-time Search** - Instant filtering as you type
- **Multi-filter Support** - Combine search, severity, and time filters
- **Modal Details** - Rich vulnerability information popups
- **Chart Visualizations** - Severity and source distribution
- **Pagination** - Efficient navigation through large datasets
- **Keyboard Shortcuts** - ESC to close modals, / to focus search

---

## 🔒 Privacy & Security

### Client-Side Architecture
- ✅ **No Backend** - Everything runs in your browser
- ✅ **No Data Collection** - Zero tracking or analytics
- ✅ **No Cookies** - Only localStorage for theme preference
- ✅ **No External Requests** - All data loaded from static files
- ✅ **Open Source** - Fully auditable code

### API Security (Asset Scanner)
- ✅ **GitHub Secrets** - API keys never in code
- ✅ **Build-time Injection** - Keys injected during deployment
- ✅ **Input Validation** - Regex validation for IPs and domains
- ✅ **CSP Headers** - Content Security Policy enabled

---

## 📖 Usage Guide

### Navigation
1. **Dashboard** - Overview with statistics and charts
2. **Source Tabs** - Individual vulnerability feeds
3. **Asset Scanner** - IP/domain exposure scanning

### Searching & Filtering
- **Search Box** - Enter CVE ID, package name, or keywords
- **Severity Filter** - Filter by Critical, High, Medium, Low
- **Time Filter** - Show vulnerabilities from last 7, 30, or 90 days
- **Reset Button** - Clear all filters

### Viewing Details
- Click any vulnerability card to open detailed modal
- View full description, CVSS scores, references, affected packages
- Click reference links to visit official sources

### Asset Scanning
1. Navigate to **Asset Scanner** tab
2. Enter IP address or domain name
3. Click **Scan Asset**
4. View results and export as JSON or CSV

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Styling** | Custom CSS with Glassmorphism |
| **Charts** | Chart.js 4.4.0 |
| **Fonts** | Google Fonts (Inter) |
| **Automation** | GitHub Actions, Python 3.11 |
| **Data Processing** | Python (requests, zipfile) |
| **Hosting** | GitHub Pages |
| **Data Sources** | OSV.dev, CISA, Red Hat Security |

---

## 📋 File Structure

```
VulnFeed-main/
├── .github/
│   └── workflows/
│       └── osv-feed-update.yml    # Automated data fetching
├── data/                           # Vulnerability JSON files
│   ├── cisa-kev.json
│   ├── redhat-cves.json
│   ├── almalinux.json
│   ├── debian.json
│   └── ... (other ecosystems)
├── scripts/
│   ├── fetch_osv_data.py          # Data fetching script
│   └── generate_stats.py          # Statistics generation
├── index.html                      # Main dashboard
├── app.js                          # Application logic
├── favicon.ico                     # Site icon
├── README.md                       # This file
└── LICENSE                         # Apache 2.0 License
```

---

## 🔧 Configuration

### Modify Update Frequency
Edit `.github/workflows/osv-feed-update.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  # Change to:
  - cron: '0 */12 * * *' # Every 12 hours
  # Or:
  - cron: '0 0 * * *'    # Daily at midnight
```

### Add New OSV Ecosystems
Edit `scripts/fetch_osv_data.py`:

```python
OSV_ECOSYSTEMS = [
    'AlmaLinux',
    'Debian',
    # Add your ecosystem:
    'YourEcosystem',
]
```

### Customize UI Colors
Edit CSS variables in `index.html`:

```css
:root[data-theme="light"] {
    --accent: #6366f1;        /* Primary color */
    --accent-hover: #4f46e5;  /* Hover color */
    /* ... other variables */
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Report Issues
- Found a bug? [Open an issue](https://github.com/yourusername/VulnFeed/issues)
- Have a feature idea? Share your suggestions!

### 💻 Code Contributions
- Improve UI/UX design
- Add new data sources
- Optimize performance
- Enhance mobile experience
- Add new features

### ⭐ Community Support
- Star ⭐ the repository
- Share with your security team
- Write blog posts or tutorials
- Provide feedback and suggestions

---

## 📄 License

Licensed under the **Apache 2.0 License** - see [LICENSE](./LICENSE) file.

### Data Attribution
- **CISA KEV** - Public domain (U.S. Government data)
- **Red Hat Data** - Used under appropriate licenses
- **OSV.dev Data** - Open Source Vulnerabilities database
- **Linux Distribution Data** - Respective distribution security feeds

---

## 🙏 Acknowledgments

- **CISA** - For maintaining the Known Exploited Vulnerabilities catalog
- **Red Hat** - For enterprise security advisories and transparency
- **OSV.dev** - For comprehensive open source vulnerability data
- **Linux Distributions** - For their security teams and public advisories
- **GitHub** - For Pages and Actions infrastructure
- **Security Community** - For contributions and feedback

---

## 📞 Support & Contact

**Project:** Onyx Vuln Intelligence Dashboard  
**Repository:** [GitHub](https://github.com/yourusername/VulnFeed)  
**Issues:** [Report a Bug](https://github.com/yourusername/VulnFeed/issues)  
**Discussions:** [Join the Conversation](https://github.com/yourusername/VulnFeed/discussions)

---

## 🎯 Use Cases

### 👩‍💻 **Security Teams**
- Threat prioritization and tracking
- Patch management workflows
- Incident response planning
- CISA BOD 22-01 compliance

### 🏢 **Enterprise IT**
- Multi-OS environment monitoring
- Database security tracking
- Package ecosystem vulnerability management
- Asset exposure assessment

### 🧠 **Security Researchers**
- Vulnerability trend analysis
- Threat intelligence gathering
- Cross-ecosystem research
- Exploit tracking

### 🧑‍💻 **System Administrators**
- Patch prioritization
- Vendor-specific monitoring
- Compliance reporting
- Security posture assessment

---

## ⭐ Support the Project

If you find **Onyx Intelligence** useful for your security workflow, please give it a ⭐!

Your support helps others discover the project and contributes to its development.

---

### Built with ❤️ for the Security Community

**Helping professionals stay ahead of threats across enterprise environments, Linux distributions, databases, and package ecosystems.**

---

[**Live Demo**](https://yourusername.github.io/VulnFeed/) • [**Report Bug**](https://github.com/yourusername/VulnFeed/issues) • [**Request Feature**](https://github.com/yourusername/VulnFeed/issues/new) • [**View Source**](https://github.com/yourusername/VulnFeed)

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/1200x600/667eea/ffffff?text=Dashboard+Overview)

### Vulnerability Details
![Details Modal](https://via.placeholder.com/1200x600/764ba2/ffffff?text=Vulnerability+Details)

### Asset Scanner
![Asset Scanner](https://via.placeholder.com/1200x600/6366f1/ffffff?text=Asset+Exposure+Scanner)

### Dark Mode
![Dark Mode](https://via.placeholder.com/1200x600/1e1b4b/ffffff?text=Dark+Mode+Interface)

---

## 🔮 Roadmap

### Planned Features
- [ ] **SBOM Upload** - Upload and analyze Software Bill of Materials
- [ ] **Local Agent** - Offline scanning script for air-gapped environments
- [ ] **MITRE ATT&CK Mapping** - Link vulnerabilities to attack techniques
- [ ] **Email/Webhook Notifications** - Automated risk alerts
- [ ] **Custom Dashboards** - User-configurable views
- [ ] **Historical Trends** - Vulnerability timeline analysis
- [ ] **API Endpoint** - RESTful API for integration
- [ ] **Browser Extension** - Quick vulnerability lookup

---

**Last Updated:** 2025-12-04  
**Version:** 2.0.0 - Onyx Intelligence Edition
