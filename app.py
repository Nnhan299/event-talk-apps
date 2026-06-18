import xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

def fetch_and_parse_feed():
    # Fetch feed content
    response = requests.get(FEED_URL, timeout=15)
    response.raise_for_status()
    
    # Parse XML
    root = ET.fromstring(response.content)
    
    # Atom namespace
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    
    entries = []
    
    # Process each entry in the feed
    for entry in root.findall('atom:entry', ns):
        title = entry.find('atom:title', ns)
        date_str = title.text.strip() if title is not None else "Unknown Date"
        
        entry_id = entry.find('atom:id', ns)
        entry_id_str = entry_id.text.strip() if entry_id is not None else ""
        
        updated = entry.find('atom:updated', ns)
        updated_str = updated.text.strip() if updated is not None else ""
        
        # Link in atom feeds usually has href in attribs
        link = entry.find('atom:link', ns)
        link_str = ""
        if link is not None:
            link_str = link.attrib.get('href', '').strip()
        
        content = entry.find('atom:content', ns)
        content_html = content.text.strip() if content is not None else ""
        
        # Parse the HTML content to break it down by h3 section headers
        soup = BeautifulSoup(content_html, 'html.parser')
        h3_tags = soup.find_all('h3')
        
        if not h3_tags:
            # No subheadings, treat whole entry content as a single update
            entries.append({
                'id': entry_id_str,
                'date': date_str,
                'updated': updated_str,
                'link': link_str,
                'type': 'Update',
                'content_html': content_html,
                'content_text': soup.get_text().strip()
            })
        else:
            # Split the entry contents by the h3 tags to isolate individual items
            current_type = "Update"
            current_blocks = []
            update_idx = 0
            
            for child in soup.children:
                if child.name == 'h3':
                    # If we already have content accumulated, save it as an item
                    if current_blocks:
                        raw_html = ''.join(current_blocks)
                        content_text = BeautifulSoup(raw_html, 'html.parser').get_text().strip()
                        entries.append({
                            'id': f"{entry_id_str}_{update_idx}",
                            'date': date_str,
                            'updated': updated_str,
                            'link': link_str,
                            'type': current_type,
                            'content_html': raw_html,
                            'content_text': content_text
                        })
                        update_idx += 1
                    current_type = child.get_text().strip()
                    current_blocks = []
                elif child.name:
                    current_blocks.append(str(child))
            
            # Save the final block of the loop
            if current_blocks:
                raw_html = ''.join(current_blocks)
                content_text = BeautifulSoup(raw_html, 'html.parser').get_text().strip()
                entries.append({
                    'id': f"{entry_id_str}_{update_idx}",
                    'date': date_str,
                    'updated': updated_str,
                    'link': link_str,
                    'type': current_type,
                    'content_html': raw_html,
                    'content_text': content_text
                })
                
    return entries

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/updates')
def get_updates():
    try:
        updates = fetch_and_parse_feed()
        return jsonify(updates)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
