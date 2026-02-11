#!/usr/bin/env python3
"""
Migration script: Convert inline sticky menu HTML to Web Component.

For each HTML file, this script:
1. Removes the inline sticky menu block (<!-- Sticky Menu --> ... closing </div>)
2. Replaces <script src="sticky-menu.js"> with <script src="sticky-menu-component.js">
3. Adds <sticky-menu></sticky-menu> just before the component script tag
"""

import re
import glob
import os

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Remove the inline sticky menu block:
    #    From "<!-- Sticky Menu -->" to the closing "</div>" of sticky-menu-container
    #    The pattern: <!-- Sticky Menu --> followed by <div id="sticky-menu-container"> ... </div>
    #    We need to match the outermost </div> that closes sticky-menu-container
    pattern = r'\n?\s*<!-- Sticky Menu -->\s*\n\s*<div id="sticky-menu-container">.*?</button>\s*\n\s*</div>\s*\n?'
    content = re.sub(pattern, '\n', content, flags=re.DOTALL)

    # 2. Replace <script src="sticky-menu.js"></script>
    #    with <sticky-menu></sticky-menu> + <script src="sticky-menu-component.js"></script>
    content = content.replace(
        '<script src="sticky-menu.js"></script>',
        '<sticky-menu></sticky-menu>\n    <script src="sticky-menu-component.js"></script>'
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Migrated: {os.path.basename(filepath)}")
    else:
        print(f"  ⚠️  No changes: {os.path.basename(filepath)}")

def main():
    html_files = sorted(glob.glob(os.path.join(DIRECTORY, '*.html')))
    # Exclude the fragment file itself
    html_files = [f for f in html_files if os.path.basename(f) != 'sticky-menu.html']

    print(f"Found {len(html_files)} HTML files to migrate.\n")

    for filepath in html_files:
        migrate_file(filepath)

    print(f"\nDone! All files migrated to use <sticky-menu> Web Component.")

if __name__ == '__main__':
    main()
