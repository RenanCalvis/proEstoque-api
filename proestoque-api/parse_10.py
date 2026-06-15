import sys
import json
from bs4 import BeautifulSoup

with open('/Users/renan/.gemini/antigravity-ide/brain/da54f29f-950f-419e-ba8a-65d63a33b8cf/.system_generated/steps/173/content.md', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
text = soup.get_text(separator="\n", strip=True)

with open('/Users/renan/.gemini/antigravity-ide/brain/da54f29f-950f-419e-ba8a-65d63a33b8cf/scratch/clean_content_10.txt', 'w') as f:
    f.write(text)
