// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    toggleMobileMenu();
    mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    const html = document.documentElement;
    nav.classList.toggle('active');
    html.classList.toggle('mobile-menu-open');
}

// Testimonials slider
const testimonialGroup = document.querySelector('.testimonial-group');
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;
let autoRotateInterval;

function updateSlider() {
    testimonialsSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
    updateSlider();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
});

function startAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }

    autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }, 5000);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }
}

testimonialGroup.addEventListener('mouseenter', stopAutoRotate);
testimonialGroup.addEventListener('mouseleave', startAutoRotate);

// Contact form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Remove any existing duplicate event listeners
    const newContactForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newContactForm, contactForm);

    // Add status message div after the form
    const statusMessage = document.createElement('div');
    statusMessage.className = 'form-status';
    statusMessage.style.cssText = 'margin-top: 1rem; padding: 1rem; display: none;';
    newContactForm.parentNode.insertBefore(statusMessage, newContactForm.nextSibling);

    // Add the new event listener
    newContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        statusMessage.style.display = 'block';
        statusMessage.style.color = '#28a745';
        statusMessage.textContent = 'Thank you for your request! We will contact you shortly.';
        setTimeout(() => {
            newContactForm.reset();
        }, 100);
    });
}

// Fleet section interactive cards
const fleetGrid = document.querySelector('.fleet-grid');
const fleetCards = document.querySelectorAll('.fleet-card');

fleetCards.forEach(card => {
    card.addEventListener('click', () => {
        // If this card is already expanded, collapse it
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            return;
        }

        // Remove expanded class from all cards
        fleetCards.forEach(c => c.classList.remove('expanded'));

        // Expand the clicked card
        card.classList.add('expanded');
    });
});

// Start auto-rotation initially
startAutoRotate();

// Showcase and fleet tiles rotation
document.addEventListener('DOMContentLoaded', () => {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const fleetTiles = document.querySelectorAll('.fleet-tile');
    const fleetShowcase = document.getElementById('fleetShowcase');
    let currentIndex = 0;
    let autoRotateInterval;
    let isMobile = window.innerWidth < 992;

    function showVehicle(index) {
        // Check if elements exist before using them
        const showcaseItems = document.querySelectorAll('.showcase-item');
        const fleetTiles = document.querySelectorAll('.fleet-tile');
        
        if (!showcaseItems.length || !fleetTiles.length) {
            return; // Exit if elements don't exist
        }

        if (!isMobile) {
            // Clear any existing transitions first
            const allItems = Array.from(showcaseItems);
            allItems.forEach(item => {
                item.style.opacity = '0';
                item.classList.remove('active');
            });

            // Get next item
            const nextItem = showcaseItems[index];
            if (nextItem) {
                // Set up next item
                nextItem.classList.add('active');
                
                // Force browser reflow
                void nextItem.offsetWidth;

                // Trigger fade in
                requestAnimationFrame(() => {
                    nextItem.style.opacity = '1';
                });
            }

            // Update tiles
            fleetTiles.forEach(tile => {
                tile.classList.remove('active');
            });
            if (fleetTiles[index]) {
                fleetTiles[index].classList.add('active');
            }
        }
        currentIndex = index;
    }

    // Handle tile clicks
    fleetTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            showVehicle(index);
        });

        // Only add hover events for desktop
        if (!isMobile) {
            tile.addEventListener('mouseenter', () => stopAutoRotate());
            tile.addEventListener('mouseleave', () => startAutoRotate());
        }
    });

    // Auto-rotation functions
    function startAutoRotate() {
        if (!isMobile && !autoRotateInterval) {
            autoRotateInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % showcaseItems.length;
                showVehicle(currentIndex);
            }, 5000);
        }
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 992;

        if (wasMobile !== isMobile) {
            // Reset states when switching between mobile and desktop
            fleetTiles.forEach(tile => tile.classList.remove('expanded', 'active'));
            showcaseItems.forEach(item => item.classList.remove('active'));
            
            if (!isMobile) {
                showVehicle(currentIndex);
                startAutoRotate();
            } else {
                stopAutoRotate();
            }
        }
    });

    // Initial setup
    if (!isMobile) {
        showVehicle(0);
        startAutoRotate();
    }
});

// Technology section interactive showcase
document.addEventListener('DOMContentLoaded', () => {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const techTiles = document.querySelectorAll('.tech-tile');
    const techShowcase = document.getElementById('techShowcase');
    let currentIndex = 0;
    let autoRotateInterval;
    let isMobile = window.innerWidth < 992;

    function showTechnology(index) {
        if (isMobile) {
            const targetTile = techTiles[index];
            const expandedTile = document.querySelector('.tech-tile.expanded');
            
            // Handle collapse of clicked expanded tile immediately
            if (targetTile.classList.contains('expanded')) {
                targetTile.classList.remove('expanded');
                return;
            }

            // Handle transition between tiles
            if (expandedTile) {
                expandedTile.classList.remove('expanded');
                // Wait for collapse animation to complete before expanding new tile
                setTimeout(() => {
                    targetTile.classList.add('expanded');
                    scrollToExpandedTile(targetTile);
                }, 300); // Match this with your CSS transition duration
                return;
            }

            // Handle expansion if no other tile is expanded
            targetTile.classList.add('expanded');
            scrollToExpandedTile(targetTile);
        } else {
            const allItems = Array.from(showcaseItems);
            allItems.forEach(item => {
                item.style.opacity = '0';
                item.classList.remove('active');
            });

            const nextItem = showcaseItems[index];
            nextItem.classList.add('active');
            
            void nextItem.offsetWidth;

            requestAnimationFrame(() => {
                nextItem.style.opacity = '1';
            });

            techTiles.forEach(tile => tile.classList.remove('active'));
            techTiles[index].classList.add('active');
        }
        currentIndex = index;
    }

    // Helper function for scrolling
    function scrollToExpandedTile(tile) {
        const header = document.querySelector('#header');
        const headerHeight = header ? header.offsetHeight : 0;
        const padding = 20;
        const tilePosition = tile.getBoundingClientRect().top + window.pageYOffset - headerHeight - padding;
        
        window.scrollTo({
            top: tilePosition,
            behavior: 'smooth'
        });
    }

    function startAutoRotate() {
        if (!isMobile && !autoRotateInterval) {
            autoRotateInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % showcaseItems.length;
                showTechnology(currentIndex);
            }, 5000); // Keep 5 second interval for auto-rotation
        }
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Handle tile clicks
    techTiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            stopAutoRotate();
            showTechnology(index);
            if (!isMobile && !tile.matches(':hover')) {
                startAutoRotate();
            }
        });

        if (!isMobile) {
            tile.addEventListener('mouseenter', stopAutoRotate);
            tile.addEventListener('mouseleave', startAutoRotate);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 992;

        if (wasMobile !== isMobile) {
            techTiles.forEach(tile => tile.classList.remove('expanded', 'active'));
            showcaseItems.forEach(item => item.classList.remove('active'));
            
            if (!isMobile) {
                showTechnology(currentIndex);
                startAutoRotate();
            } else {
                stopAutoRotate();
            }
        }
    });

    // Initial setup
    if (!isMobile) {
        showTechnology(0);
        startAutoRotate();
    }
});

// Update the scroll behavior function
function scrollToElement(selector) {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
        // Get header height before any transitions
        const header = document.querySelector('#header');
        const headerHeight = header ? header.offsetHeight : 0;
        const padding = 20;

        // Use getBoundingClientRect() after ensuring element is in view
        const elementPosition = targetElement.getBoundingClientRect().top;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const offsetPosition = elementPosition + currentScroll - headerHeight - padding;

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    }
}

// Update the DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    const scrollTarget = localStorage.getItem('scrollTarget');
    const needsScroll = localStorage.getItem('needsScroll');
    
    if (scrollTarget && needsScroll === 'true') {
        // Wait for images and other resources to load
        window.addEventListener('load', () => {
            setTimeout(() => {
                scrollToElement(scrollTarget);
                localStorage.removeItem('scrollTarget');
                localStorage.removeItem('needsScroll');
            }, 100);
        });
    }

    // Add click handlers after checking for stored scroll position
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavigation(e, link));
    });

    // Keep mobile menu toggle functionality last
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('nav ul');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            navMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });
});

// Update the navigation handler
function handleNavigation(event, link) {
    const href = link.getAttribute('href');
    
    if (!href || href.startsWith('http')) {
        return;
    }

    if (href.includes('index.html#')) {
        event.preventDefault();
        const targetId = href.substring(href.indexOf('#'));
        localStorage.setItem('scrollTarget', targetId);
        localStorage.setItem('needsScroll', 'true');
        window.location.href = href;
        return;
    }

    if (href.includes('#') && !href.includes('.html')) {
        event.preventDefault();
        scrollToElement(href);
    }
}