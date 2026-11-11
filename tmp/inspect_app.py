import urllib.request
import re
import json

url = 'https://matriculation-photoshoot-qodesh-campus-church-gct.ai.studio/assets/index-CLq7ERjD.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
data = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
print('Length of JS:', len(data))

# Find asset URLs
assets = re.findall(r'["\'](/assets/[^"\']+)["\']', data)
print('Assets found:', set(assets))

css_url = 'https://matriculation-photoshoot-qodesh-campus-church-gct.ai.studio/assets/index-DD0K3TsW.css'
css_req = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'})
css_data = urllib.request.urlopen(css_req).read().decode('utf-8', errors='ignore')
print('CSS length:', len(css_data))
css_assets = re.findall(r'url\((["\']?[^)]+["\']?)\)', css_data)
print('CSS assets:', css_assets)
