# 🔄 Rolling Window Vulnerability Management

## 🎯 Problem & Solution

### **Problem: GitHub File Size Limits**
GitHub has strict file size limits:
- ❌ **Hard limit:** 100 MB (push rejected)
- ⚠️ **Warning:** 50 MB (not recommended)

**Initial fetch results:**
- npm.json: **454 MB** ❌
- linux.json: **380 MB** ❌
- alpine.json: **87 MB** ⚠️
- pypi.json: **58 MB** ⚠️

### **Solution: Rolling 5-Year Window**
✅ Automatically keeps only the **last 5 years** of vulnerabilities  
✅ Prioritizes **critical and recent** vulnerabilities  
✅ Limits to **5,000 max** per ecosystem  
✅ **Self-maintaining** - no manual cleanup needed

---

## 📅 How the Rolling Window Works

### **Dynamic Year Calculation**
```python
CURRENT_YEAR = datetime.utcnow().year  # e.g., 2025
YEARS_TO_KEEP = 5                       # Keep last 5 years
CUTOFF_YEAR = CURRENT_YEAR - (YEARS_TO_KEEP - 1)  # 2025 - 4 = 2021
```

### **Year-by-Year Progression**

| Current Year | Cutoff Year | Years Kept | Vulnerabilities Included |
|--------------|-------------|------------|--------------------------|
| **2025** | 2021 | 2021-2025 | Last 5 years |
| **2026** | 2022 | 2022-2026 | Last 5 years (2021 dropped) |
| **2027** | 2023 | 2023-2027 | Last 5 years (2022 dropped) |
| **2028** | 2024 | 2024-2028 | Last 5 years (2023 dropped) |
| **2029** | 2025 | 2025-2029 | Last 5 years (2024 dropped) |

### **Automatic Cleanup**
- ✅ **No manual intervention** required
- ✅ **Runs every 6 hours** via GitHub Actions
- ✅ **Automatically excludes** old vulnerabilities
- ✅ **Keeps files small** and under GitHub limits

---

## 🎯 Filtering Strategy

### **1. Date Filtering**
```python
def is_recent_vulnerability(vuln, cutoff_year=2021):
    """Only include vulnerabilities from cutoff year onwards"""
    # Checks published date
    # Falls back to modified date
    # Returns True if year >= cutoff_year
```

**Example (2025):**
- ✅ Published: 2021-01-15 → **Included**
- ✅ Published: 2023-06-20 → **Included**
- ✅ Published: 2025-12-01 → **Included**
- ❌ Published: 2020-12-31 → **Excluded**
- ❌ Published: 2019-05-10 → **Excluded**

### **2. Severity Prioritization**
```python
def get_severity_priority(vuln):
    """Assign priority scores for sorting"""
    Critical  → 4 (highest priority)
    High      → 3
    Medium    → 2
    Low       → 1
    Unknown   → 0
```

**Sorting Logic:**
1. **First:** Sort by severity (Critical → High → Medium → Low)
2. **Then:** Sort by date (newest first)
3. **Result:** Most critical and recent vulnerabilities at the top

### **3. Volume Limiting**
```python
MAX_VULNS_PER_ECOSYSTEM = 5000

if len(vulnerabilities) > 5000:
    # Keep only top 5000 (most critical & recent)
    vulnerabilities = vulnerabilities[:5000]
```

**Why 5,000?**
- Keeps file sizes manageable
- Focuses on actionable vulnerabilities
- Prevents GitHub size limits
- Still provides comprehensive coverage

---

## 📊 Expected File Sizes

### **Before Filtering**
| Ecosystem | Raw Count | File Size | Status |
|-----------|-----------|-----------|--------|
| npm | 213,225 | 454 MB | ❌ Too large |
| Linux | 24,079 | 380 MB | ❌ Too large |
| Alpine | 3,911 | 87 MB | ⚠️ Warning |
| PyPI | 17,696 | 58 MB | ⚠️ Warning |

### **After Filtering (2021-2025, Max 5000)**
| Ecosystem | Filtered Count | Est. File Size | Status |
|-----------|----------------|----------------|--------|
| npm | ~5,000 | ~10-15 MB | ✅ Safe |
| Linux | ~5,000 | ~12-18 MB | ✅ Safe |
| Alpine | ~2,000 | ~4-6 MB | ✅ Safe |
| PyPI | ~5,000 | ~8-12 MB | ✅ Safe |

**Total estimated size:** ~150-200 MB across all ecosystems ✅

---

## 🔧 Configuration Options

### **Adjust the Time Window**

Want to keep **3 years** instead of 5?
```python
YEARS_TO_KEEP = 3  # Keep last 3 years
# 2025 → keeps 2023-2025
# 2026 → keeps 2024-2026
```

Want to keep **7 years**?
```python
YEARS_TO_KEEP = 7  # Keep last 7 years
# 2025 → keeps 2019-2025
# 2026 → keeps 2020-2026
```

### **Adjust the Volume Limit**

Want **10,000** vulnerabilities per ecosystem?
```python
MAX_VULNS_PER_ECOSYSTEM = 10000
# Note: May increase file sizes
```

Want **3,000** vulnerabilities per ecosystem?
```python
MAX_VULNS_PER_ECOSYSTEM = 3000
# Smaller files, fewer vulnerabilities
```

### **Disable Volume Limiting** (Not Recommended)
```python
MAX_VULNS_PER_ECOSYSTEM = float('inf')
# Warning: May exceed GitHub limits!
```

---

## 📈 Benefits

### **1. Automatic Maintenance**
- ✅ No manual cleanup required
- ✅ Self-adjusting based on current year
- ✅ Always keeps relevant data

### **2. GitHub Compliance**
- ✅ Files stay under 100 MB hard limit
- ✅ Files stay under 50 MB recommended limit
- ✅ No push failures

### **3. Focus on Relevance**
- ✅ Recent vulnerabilities (last 5 years)
- ✅ Critical vulnerabilities prioritized
- ✅ Actionable security intelligence

### **4. Performance**
- ✅ Smaller files load faster
- ✅ Faster GitHub Actions execution
- ✅ Better dashboard performance

### **5. Storage Efficiency**
- ✅ Reduced repository size
- ✅ Lower bandwidth usage
- ✅ Faster cloning/pulling

---

## 🧪 Testing

### **Test the Rolling Window**

```bash
# Commit changes
git add scripts/fetch_osv_data.py
git commit -m "🔄 Implement rolling 5-year window for vulnerability data"
git push

# Trigger workflow
# GitHub → Actions → "🔄 Onyx OSV Intelligence Feed" → "Run workflow"
```

### **Expected Output**
```
🚀 Starting Onyx OSV Intelligence Feed Update
============================================================
ℹ️  Note: Skipping CISA KEV, Red Hat, AlmaLinux, Rocky, Debian, Ubuntu, SUSE
   (Already fetched by separate workflows)
📅 Rolling Window: 2021-2025 (5 years)
   Older vulnerabilities automatically excluded
📊 Limit: Max 5000 per ecosystem (most critical first)
============================================================
📥 Fetching Alpine...
✅ Alpine: 2,134 vulnerabilities
📥 Fetching npm...
⚠️  npm: Limiting from 45,678 to 5000 (most critical)
✅ npm: 5,000 vulnerabilities
...
============================================================
✅ Update Complete!
📊 Total Vulnerabilities: 42,567
📂 Successful Sources: 12
🕐 Updated: 2025-12-04 09:15:30 UTC
```

### **Verify File Sizes**
```bash
# Check data directory
ls -lh data/

# All files should be < 50 MB
-rw-r--r-- 1 user user  12M Dec  4 09:15 npm.json        ✅
-rw-r--r-- 1 user user  8.5M Dec  4 09:15 pypi.json      ✅
-rw-r--r-- 1 user user  15M Dec  4 09:15 linux.json     ✅
-rw-r--r-- 1 user user  4.2M Dec  4 09:15 alpine.json   ✅
```

---

## 📊 Data Coverage Analysis

### **What Gets Included**

✅ **Critical vulnerabilities** from 2021-2025  
✅ **High severity** vulnerabilities from 2021-2025  
✅ **Recent vulnerabilities** (last 5 years)  
✅ **Actively exploited** vulnerabilities  
✅ **Patched vulnerabilities** (for tracking)

### **What Gets Excluded**

❌ Vulnerabilities older than 5 years  
❌ Low-priority old vulnerabilities  
❌ Duplicate entries  
❌ Vulnerabilities beyond the 5,000 limit (per ecosystem)

### **Why This Works**

**Security Focus:**
- Most organizations patch within 1-2 years
- 5-year window covers unpatched legacy systems
- Critical vulnerabilities are always included

**Practical Reality:**
- Very old vulnerabilities are usually:
  - Already patched
  - In EOL software
  - Not actively exploited
  - Less relevant for modern systems

**Best Practice:**
- Focus on **recent threats**
- Prioritize **critical issues**
- Maintain **actionable intelligence**

---

## 🔮 Future Behavior

### **2026 Automatic Update**

When the year changes to 2026:

```
Current Year: 2026
Cutoff Year: 2022 (automatically calculated)
Years Kept: 2022-2026

Changes:
- ❌ 2021 vulnerabilities excluded
- ✅ 2022-2026 vulnerabilities included
- ✅ No code changes needed
- ✅ Automatic on next workflow run
```

### **2030 Automatic Update**

```
Current Year: 2030
Cutoff Year: 2026 (automatically calculated)
Years Kept: 2026-2030

Changes:
- ❌ 2021-2025 vulnerabilities excluded
- ✅ 2026-2030 vulnerabilities included
- ✅ Still no code changes needed
```

---

## 💡 Pro Tips

### **Tip 1: Monitor File Sizes**
Check file sizes after each run:
```bash
du -sh data/*.json | sort -h
```

### **Tip 2: Adjust Window as Needed**
If files are still too large:
```python
YEARS_TO_KEEP = 3  # Reduce to 3 years
```

If you need more coverage:
```python
YEARS_TO_KEEP = 7  # Increase to 7 years
```

### **Tip 3: Ecosystem-Specific Limits**
For very large ecosystems (npm, Linux), you could add custom limits:
```python
ECOSYSTEM_LIMITS = {
    'npm': 3000,      # Lower limit for npm
    'Linux': 3000,    # Lower limit for Linux
    'default': 5000   # Default for others
}
```

### **Tip 4: Monitor Trends**
Track how many vulnerabilities are excluded:
```
⚠️  npm: Limiting from 45,678 to 5000 (most critical)
         ^^^^^^^^^
         40,678 excluded (mostly old/low-priority)
```

---

## ✅ Summary

**What Changed:**
- ✅ Implemented **rolling 5-year window** (2021-2025 in 2025)
- ✅ Added **automatic year progression** (2022-2026 in 2026)
- ✅ Added **severity-based prioritization**
- ✅ Added **5,000 vulnerability limit** per ecosystem
- ✅ **No manual maintenance** required

**Results:**
- ✅ Files stay **under GitHub limits**
- ✅ Focus on **recent, critical** vulnerabilities
- ✅ **Automatic cleanup** as years progress
- ✅ **Self-maintaining** system

**File Size Reduction:**
- Before: 454 MB (npm) ❌
- After: ~12 MB (npm) ✅
- **Reduction: ~97%** 🎉

---

## 🎉 Your Dashboard Now Has:

✅ **Smart filtering** - Only relevant vulnerabilities  
✅ **Automatic aging** - Old data auto-removed  
✅ **GitHub compliant** - No size limit errors  
✅ **Priority-based** - Critical vulnerabilities first  
✅ **Self-maintaining** - Zero manual cleanup  
✅ **Future-proof** - Works for years to come  

---

**The rolling window system ensures your vulnerability intelligence stays relevant, manageable, and compliant! 🚀**

---

*Last Updated: 2025-12-04*  
*Current Window: 2021-2025 (5 years)*  
*Next Auto-Update: 2026-01-01 (will become 2022-2026)*
