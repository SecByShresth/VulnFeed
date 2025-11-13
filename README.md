# 🛡️ VulnFeed
### Centralized Vulnerability Intelligence Dashboard

A **comprehensive vulnerability intelligence platform** that aggregates security advisories from **CISA KEV, Red Hat, major Linux distributions, and popular databases** into a single, unified dashboard.

---

## 🎯 What is VulnFeed?

**VulnFeed** is a client-side web application that provides **centralized vulnerability intelligence** by aggregating security data from multiple authoritative sources. Unlike traditional CVE databases that list every vulnerability, VulnFeed focuses on **actively exploited vulnerabilities** and **critical security updates** across enterprise systems.

---

## 🌟 Why VulnFeed?

* 🎯 **Multi-Source Intelligence:** Combines CISA KEV, Red Hat, Linux distributions, and databases
* 🚨 **Action-Oriented:** Focuses on actively exploited and critical vulnerabilities
* 🔒 **Enterprise Focus:** Curated for Red Hat, Ubuntu, Debian, SUSE, and database environments
* ⏰ **Real-Time Updates:** Automated daily data collection from **OSV.dev**
* 🆓 **No API Keys:** Completely free and open access
* 💻 **Client-Side Only:** No backend, no data collection, **100% private**

---

## ✨ Key Features

### 🔍 Comprehensive Coverage

* **CISA KEV:** Actively exploited vulnerabilities tracked by U.S. Cybersecurity Agency
* **Red Hat Security:** Enterprise security advisories for RHEL and related products
* **Linux Distributions:** AlmaLinux, Rocky Linux, Amazon Linux, Arch Linux, Canonical, Debian, Ubuntu, Fedora, Oracle Linux, SUSE
* **Databases:** MySQL, PostgreSQL, Redis vulnerabilities

### 🎨 Smart Dashboard

* **Live Statistics:** Real-time vulnerability counts across all sources
* **Interactive Filtering:** Search by CVE, keyword, severity, or time range
* **Severity Indicators:** Color-coded badges for quick threat assessment
* **Source Tracking:** Clear identification of vulnerability origins
* **Responsive Design:** Works seamlessly on desktop, tablet, and mobile

### ⚡ Advanced Filtering

* **Severity Levels:** Critical, High, Medium, Low
* **Time Ranges:** Last 7, 30, 90 days, or all time
* **Search:** Real-time filtering across CVE IDs, titles, and descriptions
* **Sorting:** By date, severity, or source

---

## 📊 Supported Data Sources

### 🔴 Enterprise Linux

* **Red Hat Enterprise Linux** - Enterprise security advisories
* **Ubuntu** - Canonical security updates
* **Debian** - Stable and testing security
* **SUSE Linux** - Enterprise and openSUSE
* **Fedora** - Community-driven updates
* **Oracle Linux** - Enterprise compatibility
* **AlmaLinux** - RHEL-compatible
* **Rocky Linux** - Enterprise-grade alternative
* **Amazon Linux** - AWS-optimized
* **Arch Linux** - Rolling release security

### 🗄️ Databases

* **MySQL** - World's most popular open-source database
* **PostgreSQL** - Advanced open-source database
* **Redis** - In-memory data structure store

### 🇺🇸 Government Sources

* **CISA KEV** - Known Exploited Vulnerabilities catalog

---

## 🚀 How It Works

### 📈 Data Flow Architecture

> OSV.dev Database $\rightarrow$ GitHub Actions $\rightarrow$ JSON Files $\rightarrow$ Client Dashboard
>
> $\downarrow$ $\quad\quad\quad\downarrow$ $\quad\quad\quad\downarrow$ $\quad\quad\quad\downarrow$
>
> Multiple Sources $\quad$ Daily Fetch $\quad$ Local Storage $\quad$ Real-time Filtering

### 🔄 Update Process

* **Automated Collection:** GitHub Actions fetches data daily from **OSV.dev**
* **Intelligent Processing:** Vulnerabilities categorized by keywords and affected packages
* **JSON Storage:** Structured data stored in repository
* **Client Rendering:** Browser loads and filters data instantly

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | CSS Grid, Flexbox, Neumorphic Design |
| Automation | GitHub Actions, Python |
| Data Processing | Python with requests, zipfile |
| Hosting | GitHub Pages |
| Data Sources | OSV.dev, CISA KEV, Red Hat Security |

---

## 📋 Use Cases

### 👩‍💻 Security Teams
* Threat Prioritization
* Patch Management
* Incident Response
* Compliance (**CISA BOD 22-01**)

### 🏢 Enterprise IT
* Red Hat Environments
* Multi-OS Environments
* Database Security

### 🧠 Security Researchers
* Trend Analysis
* Threat Intelligence
* Vulnerability Research

### 🧑‍💻 System Administrators
* Patch Prioritization
* Vendor Monitoring
* Compliance Reporting

---

## 🚦 Getting Started

### 🔗 Live Dashboard
👉 [https://secbyshresth.github.io/VulnFeed/](https://secbyshresth.github.io/VulnFeed/)

**No installation required.** Just open the link and start exploring vulnerabilities.

### 🧰 Self-Hosted Deployment

1.  **Fork** this repository
2.  **Enable GitHub Actions**
    * `Settings` $\rightarrow$ `Actions` $\rightarrow$ `General` $\rightarrow$ **"Read & write permissions"**
3.  **Enable GitHub Pages**
    * `Settings` $\rightarrow$ `Pages` $\rightarrow$ `Source` $\rightarrow$ **"GitHub Actions"**
4.  **Trigger Initial Data Fetch**
    * `Actions` $\rightarrow$ **“VulnFeed - OSV.dev Centralized Feed”** $\rightarrow$ **“Run workflow”**
5.  **Access Your Dashboard**
    * `https://yourusername.github.io/VulnFeed/`

---

## 🔄 Update Frequency

* ⏰ **Daily Updates:** Automatic data refresh every **24 hours**
* 🔁 **Manual Triggers:** On-demand updates via `workflow_dispatch`
* ⚡ **Near Real-Time:** Data typically less than 24 hours old

> **Why Daily Updates?**
> OSV.dev provides daily vulnerability exports. This frequency balances freshness with GitHub Actions limits, ensuring comprehensive coverage without rate limiting.

---

## 📖 How to Use

### 🎯 Navigation

* **Dashboard:** Overview with statistics and quick access
* **CISA KEV:** Actively exploited vulnerabilities
* **Red Hat:** Enterprise security advisories
* **Linux Distributions:** Individual OS security updates
* **Databases:** MySQL, PostgreSQL, Redis vulnerabilities
* **Settings:** Theme and refresh controls

### 🔍 Search & Filter

* **Text Search:** Search across CVE IDs, titles, and descriptions
* **Severity Filter:** Focus on Critical, High, Medium, or Low severity
* **Time Filter:** Show vulnerabilities from specific time periods
* **Sort Options:** Order by date, severity, or source

### 💡 Pro Tips

* Use the search box for specific **CVE IDs** or **keywords**
* Combine **severity** and **time filters** for focused results
* Click any vulnerability card to view details on official sources
* Use dark/light theme toggle for comfortable viewing

---

## 🔒 Privacy & Security

* 🔐 **No Data Collection:** Everything runs client-side
* 🧠 **Local Processing:** All filtering happens in your browser
* 🚫 **No Tracking:** No cookies, analytics, or external requests
* ☁️ **Static Hosting:** GitHub Pages ensures security and reliability
* 📜 **Open Source:** Fully auditable code and data processing

---

## 🤝 Contributing

### 🪲 Report Issues

* Found a bug? [Open an issue](https://github.com/SecByShresth/VulnFeed/issues)
* Have a feature idea? Share your suggestions!

### 🧑‍💻 Code Contributions

* Improve UI/UX design
* Add new data sources or filters
* Optimize performance
* Enhance mobile experience

### ⭐ Community Support

* Star ⭐ the repository
* Share with your security team
* Mention in blogs or security discussions

---

## 📄 License

Licensed under the **Apache 2.0 License** — see [`LICENSE`](./LICENSE) file.

### Data Usage

* **CISA KEV:** Public domain (U.S. Government data)
* **Red Hat Data:** Used under appropriate licenses
* **OSV.dev Data:** Open Source Vulnerabilities database
* **Linux Distribution Data:** Respective distribution security feeds

---

## 🙏 Acknowledgments

* **CISA:** For maintaining the Known Exploited Vulnerabilities catalog
* **Red Hat:** For enterprise security advisories and transparency
* **OSV.dev:** For comprehensive open source vulnerability data
* **Linux Distributions:** For their security teams and public advisories
* **GitHub:** For Pages and Actions infrastructure
* **Security Community:** For contributions and feedback

---

## 📞 Contact & Support

**Author:** Shresth\
**GitHub:** [@SecByShresth](https://github.com/SecByShresth)\
**Project:** [VulnFeed](https://github.com/SecByShresth/VulnFeed)\
**Issues:** [Report a Bug](https://github.com/SecByShresth/VulnFeed/issues)\
**Discussions:** [Join the Conversation](https://github.com/SecByShresth/VulnFeed/discussions)

---

## ⭐ Support the Project

If you find **VulnFeed** useful for your security workflow, please give it a ⭐!
Your support helps others discover the project and contributes to its development.

---

### Built with ❤️ for the Security Community
Helping professionals stay ahead of threats across enterprise environments, Linux distributions, and critical infrastructure.

---

[**Live Demo**](https://secbyshresth.github.io/VulnFeed/) • [**Report Bug**](https://github.com/SecByShresth/VulnFeed/issues) • [**Request Feature**](https://github.com/SecByShresth/VulnFeed/issues/new) • [**View Source**](https://github.com/SecByShresth/VulnFeed)
