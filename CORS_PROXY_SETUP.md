# 🔧 CORS Proxy Setup Guide

## ⚠️ Why This is Needed

When your browser tries to call APIs like Shodan, VirusTotal, AbuseIPDB, and Censys directly, they're **blocked by CORS (Cross-Origin Resource Sharing)** policy. This is a browser security feature that prevents websites from making unauthorized requests to external APIs.

**Solution:** Deploy a Cloudflare Worker as a proxy. It's **free** and takes about 5 minutes.

---

## 🚀 Quick Setup (Cloudflare Worker)

### Step 1: Create a Cloudflare Account
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sign up for a free account (if you don't have one)

### Step 2: Create a Worker
1. In the dashboard, go to **Workers & Pages** → **Create Worker**
2. Give it a name like `vulnfeed-api-proxy`
3. Click **Create Worker**

### Step 3: Deploy the Code
1. Click **Edit Code** on your new worker
2. Delete the default code
3. Copy the entire contents of `cloudflare-worker-proxy.js` from this repository
4. Paste it into the editor
5. Click **Deploy**

### Step 4: Add API Keys to Worker
1. Go to your Worker → **Settings** → **Variables**
2. Add these **Secret** variables:
   | Variable Name | Value |
   |---------------|-------|
   | `CENSYS_API_TOKEN` | Your Censys API token |
   | `SHODAN_API_KEY` | Your Shodan API key |
   | `ABUSEIPDB_API_KEY` | Your AbuseIPDB API key |
   | `VT_API_KEY` | Your VirusTotal API key |
3. Click **Save and Deploy**

### Step 5: Get Your Worker URL
Your worker URL will be something like:
```
https://vulnfeed-api-proxy.YOUR-SUBDOMAIN.workers.dev
```

### Step 6: Add to GitHub Secrets
1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add a new secret:
   - **Name:** `PROXY_URL`
   - **Value:** `https://vulnfeed-api-proxy.YOUR-SUBDOMAIN.workers.dev`
3. Push any change to trigger redeployment

---

## 🧪 Test Your Proxy

After deploying, test it by visiting:
```
https://YOUR-WORKER.workers.dev/api/scan-all?target=8.8.8.8
```

You should see a JSON response with scan results from all configured APIs.

---

## 📋 Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/scan-all?target=X` | Scan with all APIs |
| `/api/abuseipdb?target=X` | AbuseIPDB only |
| `/api/virustotal?target=X` | VirusTotal only |
| `/api/shodan?target=X` | Shodan only (IP only) |
| `/api/censys?target=X` | Censys only (IP only) |

---

## 🔒 Security Notes

1. **Rate Limiting:** Cloudflare Workers have generous free limits (100,000 requests/day)
2. **API Keys:** Stored securely as encrypted environment variables in Cloudflare
3. **No Logging:** The proxy doesn't log any sensitive data
4. **HTTPS Only:** All traffic is encrypted

---

## 💡 Alternative: Use a Different CORS Proxy

If you prefer not to set up your own, you can use a public CORS proxy (not recommended for production due to security/privacy):

```javascript
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
```

However, public proxies are:
- Rate limited
- May log your requests
- Could be discontinued anytime

**Setting up your own Cloudflare Worker is highly recommended.**

---

## 🆘 Troubleshooting

### "Failed to fetch" errors
- Verify your Worker is deployed
- Check Worker logs in Cloudflare dashboard
- Ensure API keys are set correctly

### API returns 403/401 errors
- Your API key might be invalid or expired
- Some APIs have IP restrictions - check their settings

### Worker returns 500 errors
- Check Cloudflare Worker logs for details
- Ensure the code was pasted correctly

---

## 📚 API Key Sources

| Service | Get API Key |
|---------|-------------|
| Shodan | [account.shodan.io](https://account.shodan.io/) |
| VirusTotal | [virustotal.com/gui/my-apikey](https://www.virustotal.com/gui/my-apikey) |
| AbuseIPDB | [abuseipdb.com/account/api](https://www.abuseipdb.com/account/api) |
| Censys | [search.censys.io/account/api](https://search.censys.io/account/api) |
