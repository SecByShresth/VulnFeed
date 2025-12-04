#!/usr/bin/env python3
"""
Onyx OSV Intelligence Feed Fetcher
Fetches vulnerability data from OSV.dev and other sources
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

# OSV Ecosystems to fetch
OSV_ECOSYSTEMS = [
    # Linux Distributions
    'AlmaLinux',
    'Alpine',
    'Debian',
    'Rocky Linux',
    'Ubuntu',
    'SUSE',
    'Amazon Linux',
    'Arch Linux',
    'Fedora',
    'Oracle Linux',
    
    # Databases
    'Linux',  # Generic Linux kernel vulnerabilities
    
    # Package Ecosystems
    'npm',
    'PyPI',
    'Maven',
    'NuGet',
    'RubyGems',
    'Go',
    'crates.io',
    'Packagist',
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
            json.dump(data, f, indent=2, ensure_ascii=False)
        
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
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Red Hat: {len(data)} CVEs")
        return data
        
    except Exception as e:
        print(f"❌ Error fetching Red Hat CVEs: {e}")
        return []

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
                            # Add metadata
                            vuln['_metadata'] = {
                                'fetched_at': datetime.utcnow().isoformat() + 'Z',
                                'source': ecosystem_file,
                                'ecosystem': ecosystem
                            }
                            vulnerabilities.append(vuln)
                        except json.JSONDecodeError:
                            continue
        
        # Save to file
        output_file = DATA_DIR / f"{ecosystem_file}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(vulnerabilities, f, indent=2, ensure_ascii=False)
        
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
    
    total_vulnerabilities = 0
    successful_sources = 0
    
    # Fetch CISA KEV
    cisa_data = fetch_cisa_kev()
    if cisa_data:
        total_vulnerabilities += len(cisa_data.get('vulnerabilities', []))
        successful_sources += 1
    
    # Fetch Red Hat CVEs
    redhat_data = fetch_redhat_cves()
    if redhat_data:
        total_vulnerabilities += len(redhat_data)
        successful_sources += 1
    
    # Fetch OSV ecosystems
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
