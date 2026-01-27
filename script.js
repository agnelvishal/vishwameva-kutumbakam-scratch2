// Hamburger menu toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const nav = document.querySelector('.nav');

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        nav.classList.toggle('mobile-active');

        // Prevent body scroll when menu is open
        if (nav.classList.contains('mobile-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // For dropdown parent links on mobile, toggle dropdown instead of navigating
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown && window.innerWidth <= 768) {
            // Check if this link has a dropdown menu
            const dropdownMenu = parentDropdown.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                e.preventDefault();
                parentDropdown.classList.toggle('active');
                return;
            }
        }

        // Close mobile menu when clicking a regular link
        if (window.innerWidth <= 768) {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('mobile-active');
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        nav.classList.contains('mobile-active') &&
        !nav.contains(e.target) &&
        !hamburgerMenu.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        nav.classList.remove('mobile-active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    let scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.info-card, .zen-card, .membership-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Sign In button functionality
document.querySelector('.sign-in-btn').addEventListener('click', () => {
    alert('Sign In functionality will be implemented soon!');
});

// Learn More buttons
document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('More information coming soon!');
    });
});

// Zen card click handlers
document.querySelectorAll('.zen-card').forEach(card => {
    card.addEventListener('click', () => {
        const locationName = card.querySelector('h3').textContent;
        alert(`Learn more about ${locationName} - Details coming soon!`);
    });
});

// Info card click handlers
document.querySelectorAll('.info-card').forEach(card => {
    card.addEventListener('click', () => {
        const cardTitle = card.querySelector('h3').textContent;
        alert(`${cardTitle} - More information coming soon!`);
    });
});

// Hero Slider Logic
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const slideInterval = 5000;
let slideTimer;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event Listeners for Slider
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetTimer();
    });
});

// Auto Play
function startTimer() {
    slideTimer = setInterval(nextSlide, slideInterval);
}

function resetTimer() {
    clearInterval(slideTimer);
    startTimer();
}

// Initialize Slider
if (slides.length > 0) {
    startTimer();
}

// Add parallax effect to hero image (applied to active slide background)
window.addEventListener('scroll', () => {
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        const scrolled = window.pageYOffset;
        activeSlide.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

console.log('Vishwameva Kutumbakam website loaded successfully!');
