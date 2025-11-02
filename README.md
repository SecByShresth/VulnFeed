🛡️ VulnFeed - CISA Known Exploited Vulnerabilities & Red Hat Security Dashboard
A real-time vulnerability tracker that monitors actively exploited CVEs from CISA's Known Exploited Vulnerabilities (KEV) Catalog and Red Hat Security Advisories.

🎯 What is VulnFeed?
VulnFeed is a client-side web application that aggregates and displays actively exploited vulnerabilities tracked by the U.S. Cybersecurity and Infrastructure Security Agency (CISA) and critical security advisories from Red Hat. Unlike traditional CVE databases that list every vulnerability, VulnFeed focuses exclusively on vulnerabilities that are being exploited in the wild right now and critical Red Hat security updates.

Why Focus on CISA KEV & Red Hat?
🎯 High-Signal, Low-Noise: Only shows vulnerabilities confirmed to be actively exploited
🚨 Critical Threat Intelligence: These are the vulnerabilities attackers are using today
🔒 Ransomware Tracking: Identifies which vulnerabilities are used in ransomware campaigns
⏰ Action-Oriented: Shows remediation deadlines set by CISA for federal agencies
🔴 Enterprise Focus: Red Hat CVEs specifically curated for enterprise environments
🆓 No API Keys: Completely free and open access

✨ Key Features
🔍 Smart Filtering
Vendor/Product Search: Filter by specific vendors (Microsoft, Cisco, Apache, Red Hat, etc.)
Ransomware Filter: Isolate vulnerabilities used in ransomware attacks
Time Range: View vulnerabilities added in the last 7, 30, or 90 days
Red Hat Filter: Specifically filter Red Hat security advisories
Real-Time Filtering: Results update instantly as you type

📊 Interactive Dashboard
Live Statistics: Track total exploited vulnerabilities, ransomware-related CVEs, Red Hat advisories, and upcoming deadlines
Severity Indicators: Color-coded badges for quick threat assessment
Exploit Status: Clear "Exploited in the Wild" badges on every vulnerability
Ransomware Tags: Identifies vulnerabilities used in known ransomware campaigns
Red Hat Tags: Specific indicators for Red Hat security advisories

📅 Deadline Tracking
Due Date Warnings: Highlights vulnerabilities with remediation deadlines within 7 days
Sort by Due Date: Prioritize vulnerabilities based on CISA's remediation timeline
Required Actions: Shows CISA's recommended remediation steps

🔴 Red Hat Security Integration
Enterprise Focus: Curated Red Hat CVEs specifically relevant to enterprise environments
Security Advisories: Direct links to Red Hat security advisories for detailed remediation guidance
Impact Assessment: Clear severity ratings and impact analysis for Red Hat vulnerabilities
Patch Information: Available fixes and updates for Red Hat products

🎨 User Experience
Responsive Design: Works perfectly on desktop, tablet, and mobile
Hover Effects: Interactive cards with smooth animations
Direct CVE Links: Click any CVE ID to view full details on NVD
Red Hat Advisory Links: Direct access to Red Hat security advisories

🔄 Automatic Updates
GitHub Actions: Data refreshes automatically every 6 hours
No Manual Intervention: Always shows the latest exploited vulnerabilities
Version Tracking: Displays the catalog version and last update time

🚀 How It Works
Architecture
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                   │
│  (Runs every 6 hours - No API key required)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────────┐
│  CISA KEV       │     │  Red Hat Security   │
│  JSON Endpoint  │     │  Advisories API     │
│  (Public, Free) │     │  (Public, Free)     │
└────────┬────────┘     └──────────┬──────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐     ┌─────────────────────┐
│ data/cisa-kev.json │ │ data/redhat-cves.json │
│ (Cached in Repo)  │ │ (Cached in Repository) │
└────────┬────────┘     └──────────┬──────────┘
         │                         │
         └───────────┬─────────────┘
                     │
                     ▼
         ┌────────────────────────────┐
         │    GitHub Pages (HTML)     │
         │  (Client-Side JavaScript)  │
         └────────────────────────────┘

Data Flow
Automated Fetching: GitHub Actions fetches the latest CISA KEV catalog and Red Hat security advisories every 6 hours
Local Caching: Data is stored as JSON files in the repository
Client-Side Rendering: Your browser loads and filters the data in real-time
No Backend Required: Everything runs in your browser - fast and secure

📋 Use Cases
For Security Teams
Threat Prioritization: Focus remediation efforts on actively exploited vulnerabilities
Incident Response: Quickly check if vulnerabilities in your environment are being exploited
Patch Management: Track CISA's remediation deadlines and Red Hat security updates
Threat Intelligence: Monitor emerging exploit trends and ransomware campaigns
Enterprise Security: Specifically track Red Hat vulnerabilities affecting enterprise infrastructure

For Red Hat Enterprise Users
RHEL Security: Monitor vulnerabilities affecting Red Hat Enterprise Linux systems
OpenShift Security: Track container platform vulnerabilities
Middleware Updates: JBoss, Fuse, and other Red Hat middleware security
Cloud-Native Security: OpenShift Container Platform and related technologies

For Penetration Testers
Red Team Operations: Identify high-value exploit opportunities in target environments
Vulnerability Research: Track which CVEs are gaining traction in the wild
Security Assessments: Reference actively exploited vulnerabilities in reports

For IT Administrators
Vendor Monitoring: Track vulnerabilities affecting your specific vendors/products
Risk Assessment: Understand which systems are at highest risk
Compliance: Meet CISA Binding Operational Directive (BOD) 22-01 requirements
Enterprise Patching: Prioritize Red Hat security updates

For Security Researchers
Trend Analysis: Study patterns in exploited vulnerabilities over time
Ransomware Research: Analyze which vulnerabilities are weaponized by ransomware groups
Threat Landscape: Understand the current state of active exploitation

🎓 What You'll See
Vulnerability Cards Display:
CVE ID: With direct link to NVD for full technical details
Description: Clear explanation of what the vulnerability does
Exploited Badge: Confirms active exploitation in the wild
Ransomware Badge: Shows if used in ransomware campaigns (when applicable)
Red Hat Badge: Indicates Red Hat security advisory availability
Vendor & Product: Affected software and manufacturer
Date Added: When CISA added it to the KEV catalog
Due Date: CISA's recommended remediation deadline
Required Action: CISA's guidance on how to remediate

Statistics Dashboard:
Total Exploited Vulnerabilities: Current count of all tracked CVEs
Ransomware Use: Number of vulnerabilities linked to ransomware
Red Hat Advisories: Number of Red Hat security advisories tracked
Due Within 7 Days: Urgent vulnerabilities requiring immediate attention

🛠️ Technology Stack
Frontend: Pure HTML5, CSS3, and Vanilla JavaScript (no frameworks)
Styling: Modern CSS with CSS Grid and Flexbox
Data Sources: 
  - CISA Known Exploited Vulnerabilities Catalog (JSON API)
  - Red Hat Security Advisories API
Automation: GitHub Actions (scheduled workflows)
Hosting: GitHub Pages (static hosting)
Storage: Git-based data caching (no database required)

📊 Data Sources
VulnFeed uses multiple authoritative sources:

CISA Known Exploited Vulnerabilities Catalog
Authoritative: Maintained by the U.S. Department of Homeland Security
Actionable: Only includes vulnerabilities with confirmed exploitation
Comprehensive: Covers all software vendors and products
Timely: Updated multiple times daily as new exploits emerge
Compliant: Required reference for federal agencies under BOD 22-01

Red Hat Security Advisories
Enterprise Focus: Curated for Red Hat Enterprise Linux and related products
Detailed Advisories: Comprehensive security information and remediation steps
Severity Ratings: Clear impact assessment for enterprise environments
Patch Guidance: Specific version information and update procedures

Official Sources:
- CISA KEV Catalog: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- Red Hat Security: https://access.redhat.com/security/security-updates

🚦 Getting Started
Using the Live Dashboard
Simply visit: https://secbyshresth.github.io/VulnFeed/

No installation, no API keys, no configuration required!

Deploying Your Own Instance
Fork this repository

# Click "Fork" on GitHub
Enable GitHub Actions

Go to Settings → Actions → General
Select "Read and write permissions"
Click Save
Enable GitHub Pages

Go to Settings → Pages
Source: Deploy from main branch (root folder)
Click Save
Trigger First Data Fetch

Go to Actions tab
Click "Fetch CISA KEV Daily"
Click "Run workflow"
Access Your Dashboard

Visit: https://yourusername.github.io/VulnFeed/

🔄 Update Frequency
Automatic Updates: Every 6 hours via GitHub Actions
Manual Updates: Trigger anytime from the Actions tab
Data Freshness: Typically within 6 hours of source updates

Why Every 6 Hours?
CISA updates their KEV catalog multiple times per day as new exploits emerge. Red Hat regularly publishes security advisories. A 6-hour refresh cycle ensures you're always working with recent data while respecting GitHub's resource limits.

📖 How to Use
Basic Filtering
Search by Vendor: Type "Microsoft" or "Red Hat" to see vendor-specific vulnerabilities
Filter Ransomware: Select "Known Ransomware Use" to see only ransomware-related CVEs
Filter Red Hat: Use the Red Hat filter to see only Red Hat security advisories
Time Range: Choose "Last 7 Days" to see recently added vulnerabilities

Sorting Options
Date Added: See the most recently added vulnerabilities first (default)
Vendor: Alphabetically organize by vendor name
Due Date: Prioritize by remediation deadline

Advanced Tips
Combined Filters: Use vendor search + ransomware filter together
Red Hat Focus: Filter by Red Hat and sort by date to see latest advisories
Urgent Focus: Sort by "Due Date" and filter "Last 7 Days"
Trend Analysis: Switch time ranges to see exploitation patterns
Mobile Monitoring: Bookmark on your phone for on-the-go threat checks

🔒 Privacy & Security
No Data Collection: VulnFeed doesn't collect, store, or transmit any user data
Client-Side Only: All filtering and processing happens in your browser
No Tracking: No analytics, cookies, or third-party scripts
Open Source: Fully transparent - audit the code yourself
Static Hosting: Served via GitHub Pages (no server-side code)

🤝 Contributing
Contributions are welcome! Here's how you can help:

Report Issues
Found a bug? Open an issue on GitHub
Have a feature request? Let us know!

Submit Pull Requests
Improve the UI/UX
Add new filtering options
Enhance data visualization
Fix bugs or improve performance
Add support for additional data sources

Spread the Word
Star this repository ⭐
Share with your security team
Write about it in security blogs
Present it at security meetups

📄 License
This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

Data Usage
The CISA Known Exploited Vulnerabilities Catalog is public domain data provided by the U.S. Government. No copyright restrictions apply to the data itself.
Red Hat security data is used in accordance with Red Hat's terms of service.

🙏 Acknowledgments
CISA: For maintaining the authoritative KEV catalog
Red Hat: For comprehensive security advisories and enterprise focus
NVD (NIST): For CVE details and documentation
GitHub: For free hosting and Actions infrastructure
Security Community: For feedback and contributions

📞 Contact & Support
Author: Shresth
GitHub: @SecByShresth
Project: VulnFeed Repository
Issues: Report a Bug

⭐ Star History
If you find VulnFeed useful, please consider giving it a star! It helps others discover the project.

Built with ❤️ for the Security Community

Made to help security professionals stay ahead of threats, with special focus on enterprise Red Hat environments

Report Bug • Request Feature • Live Demo