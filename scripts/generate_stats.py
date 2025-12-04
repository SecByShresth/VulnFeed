#!/usr/bin/env python3
"""
Generate statistics and insights from vulnerability data
"""

import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

DATA_DIR = Path("data")

def generate_stats():
    """Generate comprehensive statistics"""
    print("📊 Generating statistics...")
    
    stats = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'total_vulnerabilities': 0,
        'by_severity': defaultdict(int),
        'by_source': {},
        'by_ecosystem': defaultdict(int),
        'recent_critical': [],
        'top_vendors': defaultdict(int)
    }
    
    # Process all JSON files
    for json_file in DATA_DIR.glob('*.json'):
        if json_file.name.startswith('_'):
            continue
            
        source_name = json_file.stem
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Handle different data formats
            if source_name == 'cisa-kev':
                vulns = data.get('vulnerabilities', [])
            elif isinstance(data, list):
                vulns = data
            else:
                continue
            
            count = len(vulns)
            stats['total_vulnerabilities'] += count
            stats['by_source'][source_name] = count
            
            # Analyze vulnerabilities
            for vuln in vulns[:1000]:  # Limit to avoid memory issues
                # Severity
                severity = None
                if 'severity' in vuln:
                    severity = str(vuln['severity']).lower()
                elif 'database_specific' in vuln and 'severity' in vuln['database_specific']:
                    severity = str(vuln['database_specific']['severity']).lower()
                
                if severity:
                    stats['by_severity'][severity] += 1
                
                # Ecosystem
                if '_metadata' in vuln and 'ecosystem' in vuln['_metadata']:
                    stats['by_ecosystem'][vuln['_metadata']['ecosystem']] += 1
                
                # Vendor tracking (CISA KEV)
                if 'vendorProject' in vuln:
                    stats['top_vendors'][vuln['vendorProject']] += 1
            
            print(f"  ✅ {source_name}: {count} vulnerabilities")
            
        except Exception as e:
            print(f"  ⚠️  Error processing {source_name}: {e}")
    
    # Sort and limit top vendors
    stats['top_vendors'] = dict(sorted(
        stats['top_vendors'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:20])
    
    # Convert defaultdicts to regular dicts
    stats['by_severity'] = dict(stats['by_severity'])
    stats['by_ecosystem'] = dict(stats['by_ecosystem'])
    
    # Save statistics
    output_file = DATA_DIR / '_statistics.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    
    print(f"\n📊 Statistics Summary:")
    print(f"  Total Vulnerabilities: {stats['total_vulnerabilities']:,}")
    print(f"  Data Sources: {len(stats['by_source'])}")
    print(f"  Ecosystems: {len(stats['by_ecosystem'])}")
    print(f"  Severity Breakdown: {dict(stats['by_severity'])}")

if __name__ == '__main__':
    generate_stats()
