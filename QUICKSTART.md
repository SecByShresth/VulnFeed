# 🚀 Quick Start Guide - Onyx Vuln Intelligence Dashboard

## 📋 Prerequisites
- GitHub account
- Git installed locally
- Modern web browser

---

## ⚡ 5-Minute Setup

### 1️⃣ **Upload to GitHub** (2 minutes)

```bash
# Navigate to project directory
cd c:/Users/ASUS/Downloads/VulnFeed-main/VulnFeed-main

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "🎉 Initial commit: Onyx Vuln Intelligence Dashboard"

# Create main branch
git branch -M main

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/VulnFeed.git

# Push to GitHub
git push -u origin main
```

### 2️⃣ **Enable GitHub Actions** (1 minute)

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under "Workflow permissions":
   - Select **"Read and write permissions"**
   - Check **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### 3️⃣ **Enable GitHub Pages** (1 minute)

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Click **Save**

### 4️⃣ **Run First Data Fetch** (1 minute)

1. Go to **Actions** tab
2. Click **"🔄 Onyx OSV Intelligence Feed"**
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for completion (green checkmark)

### 5️⃣ **Access Your Dashboard** (Instant!)

Visit: `https://YOUR_USERNAME.github.io/VulnFeed/`

---

## 🎯 What You Get

✅ **Live Dashboard** - Accessible from anywhere  
✅ **Auto-Updates** - Every 6 hours  
✅ **15+ Data Sources** - CISA, Red Hat, Linux, Databases, Packages  
✅ **Premium UI** - Light/Dark themes  
✅ **Interactive Charts** - Severity distribution  
✅ **Advanced Search** - Filter by CVE, severity, time  

---

## 🔧 Optional: Add Asset Scanner

### Get Free API Keys

1. **Censys** (Recommended)
   - Sign up: https://search.censys.io/register
   - Get API credentials: https://search.censys.io/account/api
   - Free tier: 250 queries/month

2. **Shodan** (Alternative)
   - Sign up: https://account.shodan.io/register
   - Get API key: https://account.shodan.io/
   - Free tier: 100 queries/month

### Add to GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   - Name: `CENSYS_API_ID`, Value: `your_api_id`
   - Name: `CENSYS_API_SECRET`, Value: `your_api_secret`
   - Or: `SHODAN_API_KEY`, Value: `your_api_key`

---

## 📱 Test Locally

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve

# Then open: http://localhost:8000
```

---

## 🎨 Customize

### Change Theme Colors
Edit `index.html`, find:
```css
:root[data-theme="light"] {
    --accent: #6366f1;  /* Change this! */
}
```

### Change Update Frequency
Edit `.github/workflows/osv-feed-update.yml`:
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  # Change to:
  - cron: '0 0 * * *'    # Daily
```

### Add More Data Sources
Edit `scripts/fetch_osv_data.py`:
```python
OSV_ECOSYSTEMS = [
    'AlmaLinux',
    # Add yours:
    'YourEcosystem',
]
```

---

## ❓ Troubleshooting

### Dashboard Not Loading?
- Check GitHub Pages is enabled
- Wait 2-3 minutes after first push
- Check Actions tab for errors

### No Data Showing?
- Run workflow manually (Actions tab)
- Check workflow completed successfully
- Verify `data/` folder has JSON files

### Charts Not Rendering?
- Check browser console for errors
- Ensure Chart.js CDN is accessible
- Try clearing browser cache

---

## 📚 Next Steps

1. ✅ **Customize** - Change colors, logo, title
2. ✅ **Share** - Send link to your team
3. ✅ **Star** - Star the repository
4. ✅ **Contribute** - Improve and share back
5. ✅ **Monitor** - Check for updates regularly

---

## 🆘 Need Help?

- 📖 Read: [README.md](README.md)
- 📝 Check: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- 🐛 Report: [GitHub Issues](https://github.com/YOUR_USERNAME/VulnFeed/issues)
- 💬 Discuss: [GitHub Discussions](https://github.com/YOUR_USERNAME/VulnFeed/discussions)

---

## ✨ You're Done!

Your **Onyx Vuln Intelligence Dashboard** is now:
- ✅ Live on GitHub Pages
- ✅ Auto-updating every 6 hours
- ✅ Tracking 15+ vulnerability sources
- ✅ Ready for your security team

**Enjoy your new vulnerability intelligence platform! 🎉**

---

*Total setup time: ~5 minutes*  
*Maintenance required: Zero (fully automated)*  
*Cost: Free (GitHub Pages + OSV.dev)*
