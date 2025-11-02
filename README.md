# 🛡️ VulnFeed  
### CISA Known Exploited Vulnerabilities & Red Hat Security Dashboard  

A **real-time vulnerability tracker** that monitors actively exploited CVEs from **CISA's Known Exploited Vulnerabilities (KEV)** Catalog and **Red Hat Security Advisories**.

---

## 🎯 What is VulnFeed?

**VulnFeed** is a client-side web application that aggregates and displays actively exploited vulnerabilities tracked by the **U.S. Cybersecurity and Infrastructure Security Agency (CISA)** and critical security advisories from **Red Hat**.  

Unlike traditional CVE databases that list every vulnerability, VulnFeed focuses exclusively on vulnerabilities that are **actively exploited in the wild** and **critical Red Hat security updates**.

---

## 🧭 Why Focus on CISA KEV & Red Hat?

- 🎯 **High-Signal, Low-Noise:** Only shows vulnerabilities confirmed to be actively exploited  
- 🚨 **Critical Threat Intelligence:** These are the vulnerabilities attackers are using today  
- 🔒 **Ransomware Tracking:** Identifies which vulnerabilities are used in ransomware campaigns  
- ⏰ **Action-Oriented:** Shows remediation deadlines set by CISA for federal agencies  
- 🔴 **Enterprise Focus:** Red Hat CVEs curated for enterprise environments  
- 🆓 **No API Keys:** Completely free and open access  

---

## ✨ Key Features

### 🔍 Smart Filtering
- **Vendor/Product Search:** Filter by Microsoft, Cisco, Apache, Red Hat, etc.  
- **Ransomware Filter:** Isolate vulnerabilities used in ransomware attacks  
- **Time Range:** View vulnerabilities added in the last 7, 30, or 90 days  
- **Red Hat Filter:** Focus specifically on Red Hat security advisories  
- **Real-Time Filtering:** Results update instantly as you type  

---

## 📊 Interactive Dashboard

- **Live Statistics:** Track total exploited vulnerabilities, ransomware-related CVEs, Red Hat advisories, and deadlines  
- **Severity Indicators:** Color-coded badges for quick threat assessment  
- **Exploit Status:** Clear “Exploited in the Wild” badges on every vulnerability  
- **Ransomware Tags:** Identify ransomware-linked vulnerabilities  
- **Red Hat Tags:** Highlight Red Hat security advisories  

---

## 📅 Deadline Tracking

- **Due Date Warnings:** Highlights vulnerabilities with deadlines within 7 days  
- **Sort by Due Date:** Prioritize based on CISA’s remediation timeline  
- **Required Actions:** Shows CISA’s recommended remediation steps  

---

## 🔴 Red Hat Security Integration

- **Enterprise Focus:** Red Hat CVEs relevant to enterprise environments  
- **Security Advisories:** Direct links to Red Hat advisories and fixes  
- **Impact Assessment:** Severity ratings and detailed impact analysis  
- **Patch Information:** Version-specific fix details  

---

## 🎨 User Experience

- 💻 **Responsive Design:** Works seamlessly on desktop, tablet, and mobile  
- ✨ **Hover Effects:** Smooth interactive cards  
- 🔗 **Direct CVE Links:** View full details on NVD  
- 🧩 **Red Hat Advisory Links:** Quick access to official remediation pages  

---

## 🔄 Automatic Updates

- ⚙️ **GitHub Actions:** Data refreshes every 6 hours  
- 🙌 **No Manual Intervention:** Always up-to-date  
- 🕒 **Version Tracking:** Displays catalog version and last update time  

---

## 🚀 How It Works

### 🧱 Architecture

┌──────────────────────────────────────────────┐
│ GitHub Actions Workflow │
│ (Runs every 6 hours - No API key required) │
└───────────────┬──────────────────────────────┘
│
┌─────────┴─────────┐
▼ ▼
┌──────────────┐ ┌───────────────┐
│ CISA KEV │ │ Red Hat Sec. │
│ JSON Feed │ │ Advisories API│
└──────┬───────┘ └──────┬────────┘
│ │
▼ ▼
┌───────────────┐ ┌──────────────────┐
│ data/cisa.json│ │ data/redhat.json│
└───────────────┘ └──────────────────┘
│ │
└───────────┬─────────┘
▼
┌──────────────────────┐
│ GitHub Pages (HTML) │
│ Client-Side JS App │
└──────────────────────┘

### 📈 Data Flow

- **Automated Fetching:** Every 6 hours via GitHub Actions  
- **Local Caching:** JSON data stored in repo  
- **Client-Side Rendering:** Fast, browser-only filtering  
- **No Backend:** 100% static and secure  

---

## 📋 Use Cases

### 👩‍💻 For Security Teams
- Threat prioritization  
- Incident response  
- Patch management  
- Threat intelligence tracking  

### 🏢 For Red Hat Enterprise Users
- RHEL, OpenShift, Middleware, Cloud security tracking  

### 🧠 For Security Researchers
- Trend analysis  
- Ransomware correlation  
- Threat landscape visualization  

### 🧑‍💻 For IT Administrators
- Vendor risk monitoring  
- Compliance (CISA BOD 22-01)  
- Enterprise patch prioritization  

---

## 🎓 What You’ll See

### 🪪 Vulnerability Cards
- **CVE ID:** Linked to NVD  
- **Description:** Summary of impact  
- **Exploited Badge:** Confirms active exploitation  
- **Ransomware/Red Hat Badges:** Special tags  
- **Vendor/Product:** Affected software  
- **Due Date & Action:** CISA remediation info  

### 📊 Statistics Dashboard
- Total exploited vulnerabilities  
- Ransomware-related CVEs  
- Red Hat advisories tracked  
- Urgent vulnerabilities (due <7 days)  

---

## 🛠️ Technology Stack

| Component | Technology |
|------------|-------------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Styling | CSS Grid, Flexbox |
| Automation | GitHub Actions |
| Hosting | GitHub Pages |
| Data Storage | GitHub JSON cache |
| Data Sources | CISA KEV, Red Hat Security API |

---

## 📊 Data Sources

### **CISA KEV Catalog**
- **Authoritative:** U.S. DHS-maintained  
- **Actionable:** Only confirmed exploits  
- **Updated Frequently:** Multiple times daily  
- **Mandatory Reference:** Federal compliance (BOD 22-01)  

### **Red Hat Security Advisories**
- **Enterprise Focus:** RHEL, OpenShift, JBoss  
- **Detailed Advisories:** With patch/fix info  
- **Severity Ratings:** Clear and standardized  

📎 **Official Sources:**
- [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)  
- [Red Hat Security Updates](https://access.redhat.com/security/security-updates)

---

## 🚦 Getting Started

### 🔗 Live Dashboard
👉 [https://secbyshresth.github.io/VulnFeed/](https://secbyshresth.github.io/VulnFeed/)

No installation. No API keys. No config.

### 🧰 Deploy Your Own
1. **Fork** this repo  
2. **Enable GitHub Actions**  
   - Settings → Actions → General → “Read & write permissions”  
3. **Enable GitHub Pages**  
   - Settings → Pages → Source → “main” branch  
4. **Trigger First Fetch**  
   - Actions → “Fetch CISA KEV Daily” → “Run workflow”  
5. **Access Dashboard**  
   - `https://yourusername.github.io/VulnFeed/`

---

## 🔄 Update Frequency

- ⏰ Every 6 hours via GitHub Actions  
- 🔁 Manual trigger anytime  
- ⚡ Data usually <6 hours old  

**Why 6 hours?**  
CISA updates KEV multiple times a day; Red Hat publishes frequent advisories.  
A 6-hour cycle ensures freshness while keeping within GitHub limits.

---

## 📖 How to Use

### Basic Filters
- Search by vendor: “Microsoft”, “Red Hat”, etc.  
- Filter by ransomware use  
- Show only Red Hat advisories  
- Select time ranges: 7, 30, 90 days  

### Sorting
- **Date Added (default)**  
- **Vendor Name**  
- **Due Date**

### Advanced Tips
- Combine filters for deep insights  
- Use “Due in 7 Days” to find urgent threats  
- Track trends by adjusting time window  
- Mobile-friendly: bookmark for quick access  

---

## 🔒 Privacy & Security

- 🔐 No data collection  
- 🧠 100% client-side filtering  
- 🚫 No cookies or analytics  
- 🧩 Fully open-source & auditable  
- ☁️ Static hosting via GitHub Pages  

---

## 🤝 Contributing

### 🪲 Report Issues
- Found a bug? Open an issue  
- Have a feature idea? Share it!  

### 🧑‍💻 Submit PRs
- Improve UI/UX  
- Add new filters or visuals  
- Add more data sources  
- Optimize performance  

### ⭐ Spread the Word
- Star ⭐ the repo  
- Share with your security team  
- Mention it in blogs or talks  

---

## 📄 License

Licensed under the **Apache 2.0 License** — see [`LICENSE`](./LICENSE).  

### Data Usage
- **CISA KEV:** Public domain (U.S. Government data)  
- **Red Hat Data:** Used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license  

---

## 🙏 Acknowledgments

- **CISA:** Maintainers of the KEV catalog  
- **Red Hat:** Enterprise security advisories  
- **NVD (NIST):** CVE details  
- **GitHub:** For Pages & Actions  
- **Security Community:** For contributions & feedback  

---

## 📞 Contact & Support

**Author:** Shresth  
**GitHub:** [@SecByShresth](https://github.com/SecByShresth)  
**Project:** [VulnFeed](https://github.com/SecByShresth/VulnFeed)  
**Issues:** [Report a Bug](https://github.com/SecByShresth/VulnFeed/issues)

---

## ⭐ Star History

If you find **VulnFeed** useful — please ⭐ it!  
It helps others discover the project.

---

### Built with ❤️ for the Security Community  
Helping professionals stay ahead of threats — with a focus on **enterprise Red Hat environments**.

---

[**Report Bug**](https://github.com/SecByShresth/VulnFeed/issues) • [**Request Feature**](https://github.com/SecByShresth/VulnFeed/issues/new) • [**Live Demo**](https://secbyshresth.github.io/VulnFeed/)
