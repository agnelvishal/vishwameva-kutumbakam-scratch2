# Vishwameva Kutumbakam Website

A local recreation of the Vishwameva Kutumbakam website - "The Universal Family"

## About

This website is a scraped and recreated version of https://vishwamevakutumbak.wixsite.com/vishwameva-book

Vishwameva Kutumbakam is a shared vision promoting unity, harmony, and the concept of a universal family through Zen Abodes around the world.

## Pages Included

- **index.html** - Homepage with hero section, welcome message, and initiated zen abodes
- **story.html** - Our Dream Story page with the founding story and team members
- **vision.html** - Vision & Mission page with Akshaya Patra Economics Model
- **dream.html** - The Dream overview page with links to story, vision, and blog
- **locations.html** - Dream Zen Abodes locations around the world

## Features

- Responsive design with modern aesthetics
- Smooth scrolling navigation
- Animated cards and sections
- Gradient backgrounds matching the original design
- Interactive hover effects
- Mobile-friendly layout

## Running Locally

The website is currently running on:
```
http://localhost:3000
```

To start the server manually:
```bash
cd /home/pinkpanther/.gemini/antigravity/scratch/vishwameva-kutumbakam
npx serve .
```

Then open your browser and navigate to `http://localhost:3000`

## Future Enhancements

- Add booking functionality (as requested)
- Create remaining pages (blog, membership, FAQ, etc.)
- Add more interactive features
- Implement backend for member login and booking system

## Technologies Used

- HTML5
- CSS3 (with gradients, animations, and flexbox/grid)
- Vanilla JavaScript
- Web Components (Custom Elements)
- Google Fonts (Inter)

## Design

The design features:
- Vibrant color palette (orange, green, purple, blue gradients)
- Modern typography with Inter font
- Smooth animations and transitions
- Card-based layouts
- Responsive grid systems

---

## Sticky Menu — Web Component Architecture

The sticky social media menu (WhatsApp, Instagram, Facebook, Location) is implemented as a **Web Component** so that the HTML is defined in **one place** and automatically loaded into every page.

### How It Works

```
sticky-menu.html          ← Single source of truth (the menu HTML)
        ↓ fetched by
sticky-menu-component.js   ← Web Component that loads + wires up toggle logic
        ↓ used in
every page via:            <sticky-menu></sticky-menu>
```

1. Each HTML page contains a `<sticky-menu></sticky-menu>` custom element tag
2. When the browser encounters this tag, `sticky-menu-component.js` fetches `sticky-menu.html` via AJAX
3. The fetched HTML is injected into the `<sticky-menu>` element
4. The component then wires up the toggle button click handlers (open/close menu, overlay dismiss)

### File Structure

| File | Purpose |
|---|---|
| `sticky-menu.html` | **Edit this file** to change the menu content (icons, links, layout) |
| `sticky-menu-component.js` | Web Component class — fetches the HTML and sets up toggle logic |
| `sticky-menu.css` | All styles for the sticky menu (positioning, colors, animations) |

### What Each HTML Page Needs

Only **3 things** in each page:

```html
<!-- 1. In <head>: load the styles -->
<link rel="stylesheet" href="sticky-menu.css">

<!-- 2. Before </body>: place the custom element -->
<sticky-menu></sticky-menu>

<!-- 3. Load the component script -->
<script src="sticky-menu-component.js"></script>
```

### How to Edit the Menu

To change the sticky menu across **all pages**, edit only `sticky-menu.html`:

```html
<!-- sticky-menu.html -->
<div id="sticky-menu-container">
    <div class="menu-overlay" id="menu-overlay"></div>
    <div class="menu-items" id="menu-items">
        <!-- Add/remove/edit social buttons here -->
        <a href="https://wa.me/..." class="social-btn whatsapp-btn">...</a>
        ...
    </div>
    <button id="sticky-toggle-btn" class="sticky-toggle-btn">...</button>
</div>
```

Changes will take effect on every page automatically — no need to run any scripts.

### How the Web Component Works (Technical Details)

```javascript
// sticky-menu-component.js (simplified)
let menuHTMLPromise = null;  // Cache across instances

class StickyMenu extends HTMLElement {
    async connectedCallback() {
        // Fetch HTML once, reuse for all instances
        if (!menuHTMLPromise) {
            menuHTMLPromise = fetch('sticky-menu.html').then(r => r.text());
        }
        // Parse and inject the HTML
        const temp = document.createElement('div');
        temp.innerHTML = await menuHTMLPromise;
        while (temp.firstChild) this.appendChild(temp.firstChild);

        // Wire up toggle button + overlay click handlers
        this._initToggle();
    }
}
customElements.define('sticky-menu', StickyMenu);
```

Key CSS for the custom element:
```css
/* Makes <sticky-menu> invisible to layout so fixed positioning works */
sticky-menu {
    display: contents;
}
```

### ⚠️ Local Development Note

**VS Code Live Server** injects live-reload scripts into `.html` files served via `fetch()`, which can truncate `sticky-menu.html`. Use one of these alternatives for local dev:

```bash
# Option 1: Use npx serve (recommended)
npx serve .

# Option 2: Use Python's built-in server
python3 -m http.server 3000
```

On **Netlify** (production), this is not an issue — files are served as-is.
