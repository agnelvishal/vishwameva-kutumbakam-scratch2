// Sticky Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const stickyContainer = document.getElementById('sticky-menu-container');
    const toggleBtn = document.getElementById('sticky-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

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
});
