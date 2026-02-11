// Sticky Menu Web Component
// Fetches sticky-menu.html and injects it, then sets up toggle logic.
// Usage: <script src="sticky-menu-component.js"></script>
//        <sticky-menu></sticky-menu>

let menuHTMLPromise = null;

class StickyMenu extends HTMLElement {
    async connectedCallback() {
        // Fetch the menu HTML (cached across instances)
        if (!menuHTMLPromise) {
            menuHTMLPromise = fetch('sticky-menu.html').then(r => r.text());
        }
        const html = await menuHTMLPromise;

        // Use a temporary div to parse the HTML, then move nodes into this element.
        // This avoids innerHTML parsing issues on custom elements.
        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
            this.appendChild(temp.firstChild);
        }

        // Set up toggle logic (after HTML is injected)
        this._initToggle();
    }

    _initToggle() {
        const stickyContainer = this.querySelector('#sticky-menu-container');
        const toggleBtn = this.querySelector('#sticky-toggle-btn');
        const menuOverlay = this.querySelector('#menu-overlay');

        if (toggleBtn && stickyContainer) {
            toggleBtn.addEventListener('click', () => {
                stickyContainer.classList.toggle('active');

                // Toggle body scroll
                if (stickyContainer.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking overlay
            if (menuOverlay) {
                menuOverlay.addEventListener('click', () => {
                    stickyContainer.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        }
    }
}

customElements.define('sticky-menu', StickyMenu);
