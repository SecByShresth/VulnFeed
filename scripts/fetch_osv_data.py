#!/usr/bin/env python3
"""
Onyx OSV Intelligence Feed Fetcher
Fetches vulnerability data from OSV.dev and other sources
Filters to vulnerabilities from 2021 onwards to manage file sizes
"""

import json
import os
import sys
import zipfile
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Any
import requests

# Configuration - Rolling 3-year window
CURRENT_YEAR = datetime.utcnow().year
YEARS_TO_KEEP = 3  # Keep last 3 years of vulnerabilities (reduced from 5)
CUTOFF_YEAR = CURRENT_YEAR - (YEARS_TO_KEEP - 1)  # e.g., 2025 - 2 = 2023
MAX_VULNS_PER_ECOSYSTEM = 3000  # Maximum vulnerabilities per ecosystem (reduced from 5000)

# OSV Ecosystems to fetch
# NOTE: Excluding AlmaLinux, Debian, Rocky Linux, Ubuntu, SUSE 
# as they are already fetched by separate workflows
OSV_ECOSYSTEMS = [
    # Linux Distributions (Additional ones not covered by other workflows)
    'Alpine',           # Container-focused distribution
    'Amazon Linux',     # AWS-optimized distribution
    'Arch Linux',       # Rolling release
    'Fedora',          # Community-driven
    'Oracle Linux',    # Enterprise compatibility
    
    # Linux Kernel
    'Linux',           # Generic Linux kernel vulnerabilities
    
    # Databases
    'OSV',             # Generic OSV database vulnerabilities
    
    # Package Ecosystems (High-value additions)
    'npm',             # Node.js packages
    'PyPI',            # Python packages
    'Maven',           # Java/JVM packages
    'NuGet',           # .NET packages
    'RubyGems',        # Ruby packages
    'Go',              # Go modules
    'crates.io',       # Rust packages (Cargo)
    'Packagist',       # PHP packages (Composer)
    'Hex',             # Erlang/Elixir packages
    'Pub',             # Dart/Flutter packages
]

# OSV API Base URL
OSV_API_BASE = "https://osv-vulnerabilities.storage.googleapis.com"

# Data directory
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

def fetch_cisa_kev() -> Dict[str, Any]:
    """Fetch CISA Known Exploited Vulnerabilities"""
    print("📥 Fetching CISA KEV...")
    
    url = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Add metadata
        for vuln in data.get('vulnerabilities', []):
            vuln['_metadata'] = {
                'fetched_at': datetime.utcnow().isoformat() + 'Z',
                'source': 'cisa-kev'
            }
        
        output_file = DATA_DIR / "cisa-kev.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        
        count = len(data.get('vulnerabilities', []))
        print(f"✅ CISA KEV: {count} vulnerabilities")
        return data
        
    except Exception as e:
        print(f"❌ Error fetching CISA KEV: {e}")
        return {}

def fetch_redhat_cves() -> List[Dict[str, Any]]:
    """Fetch Red Hat CVE data"""
    print("📥 Fetching Red Hat CVEs...")
    
    url = "https://access.redhat.com/hydra/rest/securitydata/cve.json"
    
    try:
        # Fetch recent CVEs (last 90 days)
        params = {
            'per_page': 1000,
            'page': 1
        }
        
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Add metadata
        for cve in data:
            cve['_metadata'] = {
                'fetched_at': datetime.utcnow().isoformat() + 'Z',
                'source': 'redhat-cves'
            }
        
        output_file = DATA_DIR / "redhat-cves.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        
        print(f"✅ Red Hat: {len(data)} CVEs")
        return data
        
    except Exception as e:
        print(f"❌ Error fetching Red Hat CVEs: {e}")
        return []

def is_recent_vulnerability(vuln: Dict[str, Any], cutoff_year: int = CUTOFF_YEAR) -> bool:
    """Check if vulnerability is from cutoff year onwards"""
    try:
        # Check published date
        if 'published' in vuln:
            pub_date = datetime.fromisoformat(vuln['published'].replace('Z', '+00:00'))
            if pub_date.year >= cutoff_year:
                return True
        
        # Check modified date as fallback
        if 'modified' in vuln:
            mod_date = datetime.fromisoformat(vuln['modified'].replace('Z', '+00:00'))
            if mod_date.year >= cutoff_year:
                return True
        
        return False
    except:
        # If date parsing fails, include it to be safe
        return True

def get_severity_priority(vuln: Dict[str, Any]) -> int:
    """Get priority score for sorting (higher = more important)"""
    severity = None
    
    # Try to get severity from different locations
    if 'severity' in vuln:
        severity = str(vuln['severity']).lower()
    elif 'database_specific' in vuln and 'severity' in vuln['database_specific']:
        severity = str(vuln['database_specific']['severity']).lower()
    
    # Assign priority scores
    if severity:
        if 'critical' in severity:
            return 4
        elif 'high' in severity or 'important' in severity:
            return 3
        elif 'medium' in severity or 'moderate' in severity:
            return 2
        elif 'low' in severity:
            return 1
    
    return 0  # Unknown severity

def fetch_osv_ecosystem(ecosystem: str) -> List[Dict[str, Any]]:
    """Fetch vulnerabilities for a specific OSV ecosystem"""
    print(f"📥 Fetching {ecosystem}...")
    
    # Normalize ecosystem name for file naming
    ecosystem_file = ecosystem.lower().replace(' ', '-').replace('.', '-')
    
    # OSV exports are available as ZIP files
    url = f"{OSV_API_BASE}/{ecosystem}/all.zip"
    
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        # Extract ZIP file
        vulnerabilities = []
        
        with zipfile.ZipFile(BytesIO(response.content)) as zf:
            for filename in zf.namelist():
                if filename.endswith('.json'):
                    with zf.open(filename) as f:
                        try:
                            vuln = json.load(f)
                            
                            # Filter by date (2021 onwards)
                            if is_recent_vulnerability(vuln):
                                # Add metadata
                                vuln['_metadata'] = {
                                    'fetched_at': datetime.utcnow().isoformat() + 'Z',
                                    'source': ecosystem_file,
                                    'ecosystem': ecosystem
                                }
                                vulnerabilities.append(vuln)
                        except json.JSONDecodeError:
                            continue
        
        # Sort by severity and date (most critical and recent first)
        vulnerabilities.sort(
            key=lambda v: (
                get_severity_priority(v),
                v.get('modified', v.get('published', ''))
            ),
            reverse=True
        )
        
        # Limit to prevent huge files
        if len(vulnerabilities) > MAX_VULNS_PER_ECOSYSTEM:
            print(f"⚠️  {ecosystem}: Limiting from {len(vulnerabilities)} to {MAX_VULNS_PER_ECOSYSTEM} (most critical)")
            vulnerabilities = vulnerabilities[:MAX_VULNS_PER_ECOSYSTEM]
        
        # Save to file (compact format to reduce size)
        output_file = DATA_DIR / f"{ecosystem_file}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(vulnerabilities, f, ensure_ascii=False, separators=(',', ':'))
        
        print(f"✅ {ecosystem}: {len(vulnerabilities)} vulnerabilities")
        return vulnerabilities
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"⚠️  {ecosystem}: No data available (404)")
        else:
            print(f"❌ Error fetching {ecosystem}: {e}")
        return []
    except Exception as e:
        print(f"❌ Error fetching {ecosystem}: {e}")
        return []

def main():
    """Main execution function"""
    print("🚀 Starting Onyx OSV Intelligence Feed Update")
    print("=" * 60)
    print("ℹ️  Note: Skipping CISA KEV, Red Hat, AlmaLinux, Rocky, Debian, Ubuntu, SUSE")
    print("   (Already fetched by separate workflows)")
    print(f"📅 Rolling Window: {CUTOFF_YEAR}-{CURRENT_YEAR} ({YEARS_TO_KEEP} years)")
    print(f"   Older vulnerabilities automatically excluded")
    print(f"📊 Limit: Max {MAX_VULNS_PER_ECOSYSTEM} per ecosystem (most critical first)")
    print("=" * 60)
    
    total_vulnerabilities = 0
    successful_sources = 0
    
    # Skip CISA KEV - already fetched by fetch-cisa-kev.yml
    # cisa_data = fetch_cisa_kev()
    # if cisa_data:
    #     total_vulnerabilities += len(cisa_data.get('vulnerabilities', []))
    #     successful_sources += 1
    
    # Skip Red Hat CVEs - already fetched by fetch-redhat-cves.yml
    # redhat_data = fetch_redhat_cves()
    # if redhat_data:
    #     total_vulnerabilities += len(redhat_data)
    #     successful_sources += 1
    
    # Fetch OSV ecosystems (excluding duplicates)
    for ecosystem in OSV_ECOSYSTEMS:
        vulns = fetch_osv_ecosystem(ecosystem)
        if vulns:
            total_vulnerabilities += len(vulns)
            successful_sources += 1
    
    print("=" * 60)
    print(f"✅ Update Complete!")
    print(f"📊 Total Vulnerabilities: {total_vulnerabilities:,}")
    print(f"📂 Successful Sources: {successful_sources}")
    print(f"🕐 Updated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    
    # Create a summary file
    summary = {
        'last_update': datetime.utcnow().isoformat() + 'Z',
        'total_vulnerabilities': total_vulnerabilities,
        'successful_sources': successful_sources,
        'sources': list(DATA_DIR.glob('*.json'))
    }
    
    with open(DATA_DIR / '_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False, default=str)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n⚠️  Update cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)
