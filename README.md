# 🛡️ VulnFeed - CISA Known Exploited Vulnerabilities Dashboard

**A real-time vulnerability tracker that monitors actively exploited CVEs from CISA's Known Exploited Vulnerabilities (KEV) Catalog.**

---

## 🎯 What is VulnFeed?

VulnFeed is a client-side web application that aggregates and displays **actively exploited vulnerabilities** tracked by the U.S. Cybersecurity and Infrastructure Security Agency (CISA). Unlike traditional CVE databases that list every vulnerability, VulnFeed focuses exclusively on vulnerabilities that are **being exploited in the wild right now**.

### Why Focus on CISA KEV?

- **🎯 High-Signal, Low-Noise**: Only shows vulnerabilities confirmed to be actively exploited
- **🚨 Critical Threat Intelligence**: These are the vulnerabilities attackers are using today
- **🔒 Ransomware Tracking**: Identifies which vulnerabilities are used in ransomware campaigns
- **⏰ Action-Oriented**: Shows remediation deadlines set by CISA for federal agencies
- **🆓 No API Keys**: Completely free and open access

---

## ✨ Key Features

### 🔍 **Smart Filtering**
- **Vendor/Product Search**: Filter by specific vendors (Microsoft, Cisco, Apache, etc.)
- **Ransomware Filter**: Isolate vulnerabilities used in ransomware attacks
- **Time Range**: View vulnerabilities added in the last 7, 30, or 90 days
- **Real-Time Filtering**: Results update instantly as you type

### 📊 **Interactive Dashboard**
- **Live Statistics**: Track total exploited vulnerabilities, ransomware-related CVEs, and upcoming deadlines
- **Severity Indicators**: Color-coded badges for quick threat assessment
- **Exploit Status**: Clear "Exploited in the Wild" badges on every vulnerability
- **Ransomware Tags**: Identifies vulnerabilities used in known ransomware campaigns

### 📅 **Deadline Tracking**
- **Due Date Warnings**: Highlights vulnerabilities with remediation deadlines within 7 days
- **Sort by Due Date**: Prioritize vulnerabilities based on CISA's remediation timeline
- **Required Actions**: Shows CISA's recommended remediation steps

### 🎨 **User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Hover Effects**: Interactive cards with smooth animations
- **Direct CVE Links**: Click any CVE ID to view full details on NVD

### 🔄 **Automatic Updates**
- **GitHub Actions**: Data refreshes automatically every 6 hours
- **No Manual Intervention**: Always shows the latest exploited vulnerabilities
- **Version Tracking**: Displays the catalog version and last update time

---

## 🚀 How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                   │
│  (Runs every 6 hours - No API key required)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │  CISA KEV JSON Endpoint    │
         │  (Public, Free Access)     │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │   data/cisa-kev.json       │
         │   (Cached in Repository)   │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │    GitHub Pages (HTML)     │
         │  (Client-Side JavaScript)  │
         └────────────────────────────┘
```

### Data Flow

1. **Automated Fetching**: GitHub Actions fetches the latest CISA KEV catalog every 6 hours
2. **Local Caching**: Data is stored as `data/cisa-kev.json` in the repository
3. **Client-Side Rendering**: Your browser loads and filters the data in real-time
4. **No Backend Required**: Everything runs in your browser - fast and secure

---

## 📋 Use Cases

### For Security Teams
- **Threat Prioritization**: Focus remediation efforts on actively exploited vulnerabilities
- **Incident Response**: Quickly check if vulnerabilities in your environment are being exploited
- **Patch Management**: Track CISA's remediation deadlines for federal compliance
- **Threat Intelligence**: Monitor emerging exploit trends and ransomware campaigns

### For Penetration Testers
- **Red Team Operations**: Identify high-value exploit opportunities in target environments
- **Vulnerability Research**: Track which CVEs are gaining traction in the wild
- **Security Assessments**: Reference actively exploited vulnerabilities in reports

### For IT Administrators
- **Vendor Monitoring**: Track vulnerabilities affecting your specific vendors/products
- **Risk Assessment**: Understand which systems are at highest risk
- **Compliance**: Meet CISA Binding Operational Directive (BOD) 22-01 requirements

### For Security Researchers
- **Trend Analysis**: Study patterns in exploited vulnerabilities over time
- **Ransomware Research**: Analyze which vulnerabilities are weaponized by ransomware groups
- **Threat Landscape**: Understand the current state of active exploitation

---

## 🎓 What You'll See

### Vulnerability Cards Display:
- **CVE ID**: With direct link to NVD for full technical details
- **Description**: Clear explanation of what the vulnerability does
- **Exploited Badge**: Confirms active exploitation in the wild
- **Ransomware Badge**: Shows if used in ransomware campaigns (when applicable)
- **Vendor & Product**: Affected software and manufacturer
- **Date Added**: When CISA added it to the KEV catalog
- **Due Date**: CISA's recommended remediation deadline
- **Required Action**: CISA's guidance on how to remediate

### Statistics Dashboard:
- **Total Exploited Vulnerabilities**: Current count of all tracked CVEs
- **Ransomware Use**: Number of vulnerabilities linked to ransomware
- **Due Within 7 Days**: Urgent vulnerabilities requiring immediate attention

---

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks)
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Data Source**: CISA Known Exploited Vulnerabilities Catalog (JSON API)
- **Automation**: GitHub Actions (scheduled workflows)
- **Hosting**: GitHub Pages (static hosting)
- **Storage**: Git-based data caching (no database required)

---

## 📊 Data Source

VulnFeed uses the official **CISA Known Exploited Vulnerabilities Catalog**, which is:

- **Authoritative**: Maintained by the U.S. Department of Homeland Security
- **Actionable**: Only includes vulnerabilities with confirmed exploitation
- **Comprehensive**: Covers all software vendors and products
- **Timely**: Updated multiple times daily as new exploits emerge
- **Compliant**: Required reference for federal agencies under BOD 22-01

**Official CISA KEV Catalog**: https://www.cisa.gov/known-exploited-vulnerabilities-catalog

---

## 🚦 Getting Started

### Using the Live Dashboard

Simply visit: **https://secbyshresth.github.io/VulnFeed/**

No installation, no API keys, no configuration required!

### Deploying Your Own Instance

1. **Fork this repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Enable GitHub Actions**
   - Go to Settings → Actions → General
   - Select "Read and write permissions"
   - Click Save

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from main branch (root folder)
   - Click Save

4. **Trigger First Data Fetch**
   - Go to Actions tab
   - Click "Fetch CISA KEV Daily"
   - Click "Run workflow"

5. **Access Your Dashboard**
   - Visit: `https://yourusername.github.io/VulnFeed/`

---

## 🔄 Update Frequency

- **Automatic Updates**: Every 6 hours via GitHub Actions
- **Manual Updates**: Trigger anytime from the Actions tab
- **Data Freshness**: Typically within 6 hours of CISA's latest update

### Why Every 6 Hours?

CISA updates their KEV catalog multiple times per day as new exploits emerge. A 6-hour refresh cycle ensures you're always working with recent data while respecting GitHub's resource limits.

---

## 📖 How to Use

### Basic Filtering

1. **Search by Vendor**: Type "Microsoft" to see only Microsoft vulnerabilities
2. **Filter Ransomware**: Select "Known Ransomware Use" to see only ransomware-related CVEs
3. **Time Range**: Choose "Last 7 Days" to see recently added vulnerabilities

### Sorting Options

- **Date Added**: See the most recently added vulnerabilities first (default)
- **Vendor**: Alphabetically organize by vendor name
- **Due Date**: Prioritize by remediation deadline

### Advanced Tips

- **Combined Filters**: Use vendor search + ransomware filter together
- **Urgent Focus**: Sort by "Due Date" and filter "Last 7 Days"
- **Trend Analysis**: Switch time ranges to see exploitation patterns
- **Mobile Monitoring**: Bookmark on your phone for on-the-go threat checks

---

## 🔒 Privacy & Security

- **No Data Collection**: VulnFeed doesn't collect, store, or transmit any user data
- **Client-Side Only**: All filtering and processing happens in your browser
- **No Tracking**: No analytics, cookies, or third-party scripts
- **Open Source**: Fully transparent - audit the code yourself
- **Static Hosting**: Served via GitHub Pages (no server-side code)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Report Issues
- Found a bug? Open an issue on GitHub
- Have a feature request? Let us know!

### Submit Pull Requests
- Improve the UI/UX
- Add new filtering options
- Enhance data visualization
- Fix bugs or improve performance

### Spread the Word
- Star this repository ⭐
- Share with your security team
- Write about it in security blogs
- Present it at security meetups

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### CISA Data Usage
The CISA Known Exploited Vulnerabilities Catalog is public domain data provided by the U.S. Government. No copyright restrictions apply to the data itself.

---

## 🙏 Acknowledgments

- **CISA**: For maintaining the authoritative KEV catalog
- **NVD (NIST)**: For CVE details and documentation
- **GitHub**: For free hosting and Actions infrastructure
- **Security Community**: For feedback and contributions

---

## 📞 Contact & Support

- **Author**: Shresth
- **GitHub**: [@SecByShresth](https://github.com/SecByShresth)
- **Project**: [VulnFeed Repository](https://github.com/SecByShresth/VulnFeed)
- **Issues**: [Report a Bug](https://github.com/SecByShresth/VulnFeed/issues)

---

## ⭐ Star History

If you find VulnFeed useful, please consider giving it a star! It helps others discover the project.

---

<div align="center">

**Built with ❤️ for the Security Community**

Made to help security professionals stay ahead of threats

[Report Bug](https://github.com/SecByShresth/VulnFeed/issues) • [Request Feature](https://github.com/SecByShresth/VulnFeed/issues) • [Live Demo](https://secbyshresth.github.io/VulnFeed/)

</div>
