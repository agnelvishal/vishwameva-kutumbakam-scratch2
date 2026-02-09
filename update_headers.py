import os
import re

# The new header template with placeholders for active classes
HEADER_TEMPLATE = """    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="index.html">
                        <img src="assets/images/logo.png" alt="Vishwameva Kutumbakam Logo" class="header-logo">
                    </a>
                </div>
                <div class="header-center">
                    <div class="header-title">
                        <h1 class="main-title">VISHWAMEVA KUTUMBAKAM</h1>
                        <p class="sub-title">THE UNIVERSAL FAMILY</p>
                    </div>
                    <nav class="nav">
                        <ul class="nav-list">
                            <li>
                                <a href="index.html" class="nav-link{0}">Home</a>
                            </li>
                            <li class="nav-dropdown">
                                <a href="dream.html" class="nav-link{1}">The Dream</a>
                                <ul class="dropdown-menu">
                                    <li><a href="story.html"{2}>Our Dream Story</a></li>
                                    <li><a href="vision.html"{3}>Vision & Mission</a></li>
                                    <li><a href="blog.html"{4}>Wildest Dream Blog</a></li>
                                </ul>
                            </li>
                            <li class="nav-dropdown">
                                <a href="zen-abodes.html" class="nav-link{5}">Zen Abodes</a>
                                <ul class="dropdown-menu">
                                    <li><a href="locations.html"{6}>Dream Zen Abodes</a></li>
                                    <li><a href="actualized.html"{7}>Actualized Zen Abodes</a></li>
                                    <li><a href="initiated.html"{8}>Initiated Zen Abodes</a></li>
                                </ul>
                            </li>
                            <li class="nav-dropdown">
                                <a href="get-involved.html" class="nav-link{9}">Get Involved</a>
                                <ul class="dropdown-menu">
                                    <li><a href="membership-types.html"{10}>Membership Types</a></li>
                                    <li><a href="membership-benefits.html"{11}>Membership Benefits</a></li>
                                    <li><a href="faq.html"{12}>FAQs</a></li>
                                </ul>
                            </li>
                            <li class="nav-dropdown">
                                <a href="member-login.html" class="nav-link{13}">Member Login</a>
                                <ul class="dropdown-menu">
                                    <li><a href="member-profile.html"{14}>Member Profile</a></li>
                                    <li><a href="book-benefits.html"{15}>Book Benefits</a></li>
                                    <li><a href="forum.html"{16}>Members Forum</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="header-actions">
                    <a href="member-login.html" class="desktop-profile-icon" aria-label="Sign In">
                        <svg data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="50"
                            height="50" viewBox="0 0 50 50">
                            <g>
                                <path
                                    d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0">
                                </path>
                            </g>
                        </svg>
                    </a>
                    <a href="member-login.html" class="mobile-profile-icon" aria-label="Sign In">
                        <svg data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="50"
                            height="50" viewBox="0 0 50 50">
                            <g>
                                <path
                                    d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0">
                                </path>
                            </g>
                        </svg>
                    </a>
                    <button class="hamburger-menu" id="hamburger-menu" aria-label="Toggle navigation menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>"""

# Map of filenames to their active indices in the template format string
# Indices:
# 0: Home (nav-link)
# 1: The Dream (nav-link)
# 2: Our Dream Story (dropdown item)
# 3: Vision & Mission (dropdown item)
# 4: Wildest Dream Blog (dropdown item)
# 5: Zen Abodes (nav-link)
# 6: Dream Zen Abodes (dropdown item)
# 7: Actualized Zen Abodes (dropdown item)
# 8: Initiated Zen Abodes (dropdown item)
# 9: Get Involved (nav-link)
# 10: Membership Types (dropdown item)
# 11: Membership Benefits (dropdown item)
# 12: FAQs (dropdown item)
# 13: Member Login (nav-link)
# 14: Member Profile (dropdown item)
# 15: Book Benefits (dropdown item)
# 16: Members Forum (dropdown item)

FILE_MAPPING = {
    # The Dream Section
    'dream.html': [1],
    'story.html': [1, 2],
    'vision.html': [1, 3],
    'blog.html': [1, 4],
    
    # Zen Abodes Section
    'zen-abodes.html': [5],
    'locations.html': [5, 6],
    'actualized.html': [5, 7],
    'initiated.html': [5, 8],
    'auroville.html': [5], # Default to parent
    'mystery-location.html': [5],
    'angkor-wat.html': [5],
    'akureyri.html': [5],
    'booking.html': [5],
    
    # Get Involved Section
    'get-involved.html': [9],
    'membership-types.html': [9, 10],
    'membership-benefits.html': [9, 11],
    'faq.html': [9, 12],
    
    # Member Login Section
    'member-login.html': [13],
    'member-profile.html': [13, 14],
    'book-benefits.html': [13, 15],
    'forum.html': [13, 16],
    
    # Other
    'happiness-quote.html': [] # No active state
}

def generate_header(active_indices):
    args = [''] * 17
    for idx in active_indices:
        if idx in [0, 1, 5, 9, 13]: # Main nav links
            args[idx] = ' active'
        else: # Dropdown items
            args[idx] = ' class="active"'
    return HEADER_TEMPLATE.format(*args)

def update_file(filename):
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return

    with open(filename, 'r') as f:
        content = f.read()

    # Find the header block
    # Regex to capture everything between <!-- Header --> and </header> or similar
    # Using a robust regex to find the header tag and its closing tag
    
    # Pattern to find <header ...> ... </header>
    # We assume the file has a <header> tag.
    pattern = re.compile(r'(<header class="header">.*?</header>)', re.DOTALL)
    
    # Check if we should insert the <!-- Header --> comment if it's missing in the replacement?
    # The template includes <!-- Header --> at the start.
    # But the file might have <!-- Header --> before <header>.
    # Let's target the exact <header class="header"> ... </header> block.
    
    header_match = pattern.search(content)
    if not header_match:
        # Try finding with the comment if the header tag regex failed (unlikely if valid HTML)
        print(f"Could not find <header> block in {filename}")
        return

    basename = os.path.basename(filename)
    active_indices = FILE_MAPPING.get(basename, [])
    new_header = generate_header(active_indices)
    
    # We want to replace the matched header block with our new header.
    # Our new header starts with <!-- Header -->.
    # If the file has <!-- Header --> before the <header> tag, we might duplicate the comment.
    # Let's inspect the `header_match.group(0)` start.
    
    # We will simply replace the matched <header> block.
    # But we need to handle the <!-- Header --> comment preceding it if it exists, to avoid duplication or leave it cleanly.
    # Actually, simpler: just replace `header_match` with `new_header` (minus the comment if we want to be safe, or include it).
    # The template HAS the comment.
    # So if the original file has the comment, we should try to consume it in the regex to replace it too.
    
    pattern_with_comment = re.compile(r'(<!-- Header -->\s*)?<header class="header">.*?</header>', re.DOTALL)
    match_with_comment = pattern_with_comment.search(content)
    
    if match_with_comment:
        new_content = content.replace(match_with_comment.group(0), new_header)
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Could not find <header> block in {filename} (match failed)")

def main():
    root_dir = '/home/pinkpanther/Documents/code/vk main/vishwameva-kutumbakam-scratch2'
    
    # Update all files in the mapping
    for filename in FILE_MAPPING.keys():
        if filename in ['index.html']: continue # Skip index.html
        
        full_path = os.path.join(root_dir, filename)
        update_file(full_path)

if __name__ == "__main__":
    main()
