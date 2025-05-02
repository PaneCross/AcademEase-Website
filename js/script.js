// Simplified mobile menu toggle script
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    // Video background playback speed control
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
        videoBackground.playbackRate = 0.65; // Set playback speed to 0.65x
        
        // Optimize video for better performance
        videoBackground.playsInline = true;
        
        // Use requestAnimationFrame for smoother playback
        let rafId;
        const smoothPlayback = () => {
            if (videoBackground.paused) {
                videoBackground.play().catch(() => {});
            }
            rafId = requestAnimationFrame(smoothPlayback);
        };
        
        videoBackground.addEventListener('play', () => {
            rafId = requestAnimationFrame(smoothPlayback);
        });
        
        videoBackground.addEventListener('pause', () => {
            cancelAnimationFrame(rafId);
        });
        
        // Ensure video loops properly if it ends
        videoBackground.addEventListener('ended', function() {
            this.play();
        });
    }
    
    // Toggle menu when button is clicked
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle classes
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Toggle menu icon
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
            
            // Debug visibility
            console.log('Menu visible:', navMenu.classList.contains('active'));
            console.log('Menu style:', window.getComputedStyle(navMenu).left);
        });
        
        // Close menu when overlay is clicked
        overlay.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenuBtn.innerHTML = '☰';
        });
        
        // Close menu when clicking menu items
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
});

// Enhanced Who We Help carousel with background image transitions
function initWhoWeHelpCarousel() {
  const slider = document.querySelector('.who-we-help-slider');
  const slides = document.querySelectorAll('.help-item');
  const prevBtn = document.querySelector('.who-we-help .prev-btn');
  const nextBtn = document.querySelector('.who-we-help .next-btn');
  const dotsContainer = document.querySelector('.who-we-help .slide-dots');
  const bgImages = document.querySelectorAll('.who-we-help-bg-image');
  
  if (!slider || slides.length < 1) return;
  
  let currentIndex = 0;
  const slideCount = slides.length;
  let isAnimating = false;
  let autoRotateTimeout;
  
  // Create dots based on number of slides
  if (dotsContainer) {
    dotsContainer.innerHTML = ''; // Clear any existing dots
    
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slide-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      
      // Add click event listener to each dot
      dot.addEventListener('click', () => {
        stopAutoRotation();
        goToSlide(i);
        // Restart auto-rotation after delay
        setTimeout(startAutoRotation, 5000);
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // Set up initial state - mark first slide as active
  slides[0].classList.add('active');
  slides[0].style.opacity = '1';
  
  // Initialize the first dot and background as active
  updateDots();
  updateBackgrounds();
  
  // Update active slide with gradient opacity
  function updateActiveSlide() {
    // Calculate opacity for each slide based on its distance from the current slide
    slides.forEach((slide, index) => {
      // Reset all slides first
      slide.classList.remove('active');
      
      // Calculate the distance from current slide (accounting for circular nature)
      const distance = Math.abs(index - currentIndex);
      const circularDistance = Math.min(distance, slideCount - distance);
      
      // Create a gradient opacity based on distance
      // 1.0 for active slide, decreasing for adjacent slides
      let opacity;
      if (circularDistance === 0) {
        // Active slide
        opacity = 1;
        slide.classList.add('active');
      } else if (circularDistance === 1) {
        // Direct neighbors
        opacity = 0.4;
      } else if (circularDistance === 2) {
        // Second neighbors
        opacity = 0.2;
      } else {
        // Further slides
        opacity = 0.1;
      }
      
      // Apply calculated opacity
      slide.style.opacity = opacity.toString();
    });
    
    // Move slider to position
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots and backgrounds based on current index
    updateDots();
    updateBackgrounds();
  }
  
  // Update dot classes
  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.slide-dot');
    
    dots.forEach((dot, index) => {
      // For smooth transitions, use a separate animation logic
      if (index === currentIndex) {
        // First remove any existing transition for consistent timing
        dot.style.transition = 'none';
        // Force reflow to ensure the transition removal takes effect
        void dot.offsetWidth;
        // Restore transition with custom timing for expansion
        dot.style.transition = 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease, transform 0.3s ease';
        // Apply active classes and styles
        dot.classList.add('active');
      } else {
        // For inactive dots, use a slightly faster transition to contract
        dot.style.transition = 'width 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease, transform 0.3s ease';
        dot.classList.remove('active');
      }
    });
  }
  
  // Update background images
  function updateBackgrounds() {
    if (!bgImages || bgImages.length === 0) return;
    
    bgImages.forEach((bg, index) => {
      if (index === currentIndex) {
        bg.classList.add('active');
      } else {
        bg.classList.remove('active');
      }
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = index;
    updateActiveSlide();
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 600); // Slightly longer than transition time
  }
  
  // Move to next slide with smooth transition
  function goToNext() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = (currentIndex + 1) % slideCount;
    updateActiveSlide();
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 600); // Slightly longer than transition time
  }
  
  // Move to previous slide with smooth transition
  function goToPrev() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateActiveSlide();
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 600); // Slightly longer than transition time
  }
  
  // Start auto-rotation with stable timing
  function startAutoRotation() {
    // Clear any existing timeout first
    stopAutoRotation();
    
    // Set new timeout
    autoRotateTimeout = setTimeout(() => {
      goToNext();
      startAutoRotation(); // Schedule next rotation only after current one completes
    }, 5000); // Change slides every 5 seconds
  }
  
  // Stop auto-rotation
  function stopAutoRotation() {
    if (autoRotateTimeout) {
      clearTimeout(autoRotateTimeout);
      autoRotateTimeout = null;
    }
  }
  
  // Add event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoRotation();
      goToPrev();
      // Restart auto-rotation after delay
      setTimeout(startAutoRotation, 5000);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoRotation();
      goToNext();
      // Restart auto-rotation after delay
      setTimeout(startAutoRotation, 5000);
    });
  }
  
  // Handle visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRotation();
    } else {
      startAutoRotation();
    }
  });
  
  // Handle mouse interaction
  slider.addEventListener('mouseenter', stopAutoRotation);
  slider.addEventListener('mouseleave', startAutoRotation);
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoRotation();
  }, {passive: true});
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    // Restart auto-rotation after touch
    setTimeout(startAutoRotation, 5000);
  }, {passive: true});
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left
      goToNext();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right
      goToPrev();
    }
  }
  
  // Start auto-rotation
  startAutoRotation();
}

// Contact form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Remove any existing duplicate event listeners
    const newContactForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newContactForm, contactForm);

    // Set character limits on all input fields
    const nameInput = newContactForm.querySelector('[name="name"]');
    const emailInput = newContactForm.querySelector('[name="email"]');
    const phoneInput = newContactForm.querySelector('[name="phone"]');
    const messageInput = newContactForm.querySelector('[name="message"]');
    
    // Apply max lengths if elements exist
    if (nameInput) nameInput.maxLength = 50;
    if (emailInput) emailInput.maxLength = 100;
    if (phoneInput) phoneInput.maxLength = 20;
    if (messageInput) messageInput.maxLength = 1000; // Strict limit on message size
    
    // Add honeypot field for bot detection
    const honeypotField = document.createElement('div');
    honeypotField.innerHTML = `<input type="text" name="website" style="opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1;" tabindex="-1" autocomplete="off">`;
    newContactForm.appendChild(honeypotField);

    // Add status message div after the form
    const statusMessage = document.createElement('div');
    statusMessage.className = 'form-status';
    statusMessage.style.cssText = 'margin-top: 1rem; padding: 1rem; display: none;';
    newContactForm.parentNode.insertBefore(statusMessage, newContactForm.nextSibling);

    // Track submission counts and timing
    const getSubmissionData = () => {
        const data = localStorage.getItem('formSubmissions');
        return data ? JSON.parse(data) : { count: 0, lastSubmit: 0 };
    };
    
    const updateSubmissionData = () => {
        const data = getSubmissionData();
        data.count += 1;
        data.lastSubmit = Date.now();
        localStorage.setItem('formSubmissions', JSON.stringify(data));
    };

    // Add the new event listener with enhanced protection
    newContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Check honeypot field (bots will fill this, humans won't)
        const honeypot = newContactForm.querySelector('[name="website"]');
        if (honeypot && honeypot.value) {
            console.log("Bot submission detected");
            statusMessage.style.display = 'block';
            statusMessage.textContent = 'Thank you for your message!';
            statusMessage.style.color = '#28a745'; // Show success to bot but don't process
            return false;
        }
        
        // 2. Implement rate limiting
        const submissions = getSubmissionData();
        const timeSinceLastSubmit = Date.now() - submissions.lastSubmit;
        const COOLDOWN_PERIOD = 60000; // 1 minute cooldown
        const MAX_SUBMISSIONS = 5; // Max 5 submissions per session
        
        if (submissions.count >= MAX_SUBMISSIONS) {
            statusMessage.style.display = 'block';
            statusMessage.textContent = 'Maximum submission limit reached. Please try again later.';
            statusMessage.style.color = '#dc3545'; // Red error color
            return false;
        }
        
        if (timeSinceLastSubmit < COOLDOWN_PERIOD && submissions.lastSubmit !== 0) {
            const waitTime = Math.ceil((COOLDOWN_PERIOD - timeSinceLastSubmit) / 1000);
            statusMessage.style.display = 'block';
            statusMessage.textContent = `Please wait ${waitTime} seconds before submitting again.`;
            statusMessage.style.color = '#dc3545'; // Red error color
            return false;
        }
        
        // 3. Validate content
        const isValidEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };
        
        if (emailInput && !isValidEmail(emailInput.value.trim())) {
            statusMessage.style.display = 'block';
            statusMessage.textContent = 'Please enter a valid email address.';
            statusMessage.style.color = '#dc3545'; // Red error color
            return false;
        }
        
        // Check for empty name
        if (nameInput && nameInput.value.trim() === '') {
            statusMessage.style.display = 'block';
            statusMessage.textContent = 'Please enter your name.';
            statusMessage.style.color = '#dc3545';
            return false;
        }
        
        // Check for empty message or too short
        if (messageInput && messageInput.value.trim().length < 10) {
            statusMessage.style.display = 'block';
            statusMessage.textContent = 'Please enter a message (minimum 10 characters).';
            statusMessage.style.color = '#dc3545';
            return false;
        }
        
        // 4. Brief delay check (bots often submit instantly)
        const formRenderedAt = newContactForm.dataset.rendered || Date.now();
        const timeSpentOnForm = Date.now() - formRenderedAt;
        if (timeSpentOnForm < 1500) { // If submitted in less than 1.5 seconds
            console.log("Suspiciously fast submission");
            setTimeout(() => {
                processFormSubmission();
            }, 1500 - timeSpentOnForm); // Delay to make it seem natural
            return false;
        }
        
        // Process legitimate submission
        processFormSubmission();
    });
    
    // Set the rendered timestamp
    newContactForm.dataset.rendered = Date.now();
    
    function processFormSubmission() {
        // Disable submit button to prevent double submission
        const submitButton = newContactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }
        
        // Update submission tracking
        updateSubmissionData();
        
        // Show success message
        statusMessage.style.display = 'block';
        statusMessage.textContent = 'Thank you for your message! We will respond shortly.';
        statusMessage.style.color = '#28a745';
        
        // Reset form after successful submission
        setTimeout(() => {
            newContactForm.reset();
            if (submitButton) {
                submitButton.disabled = false;
            }
        }, 2000);
        
        // Here you would normally send the form data to your server
        // But we're just showing the success message for now
    }
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
        const padding = 0; // Changed from undefined/0 to 0 explicitly
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
        // Get a more accurate header height
        const header = document.querySelector('#header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        // Remove the extra padding that's causing the gap
        const padding = 0; // Changed from 20 to 0

        // Calculate position more accurately
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
            mobileMenuBtn.innerHTML = '<span>☰</span>';
        });
    });
    
    // Initialize Who We Help carousel (now includes dots)
    initWhoWeHelpCarousel();
    
    // Fix for Safari background stuttering issues
    applySafariBackgroundFixes();
    
    // Apply browser optimizations
    applyBrowserOptimizations();
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

// Improved service cards animation on mobile with better viewport timing
document.addEventListener('DOMContentLoaded', () => {
    // Only run on mobile devices
    if (window.matchMedia('(max-width: 768px)').matches) {
        const serviceCards = document.querySelectorAll('.service-card');
        const header = document.querySelector('#header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        // Create intersection observer for service cards with adjusted thresholds
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add class when card is in view, remove when out of view
                // Use a lower threshold to trigger animations earlier
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    // Keep animation active longer when scrolling out
                    // We'll check if it's at least partially visible
                    if (entry.intersectionRatio > 0) {
                        entry.target.classList.add('in-view');
                    } else {
                        entry.target.classList.remove('in-view');
                    }
                }
            });
        }, {
            // Adjust root margin to account for header and extend detection zone
            // Negative values at top for header, positive at bottom to detect earlier
            rootMargin: `-${headerHeight}px 0px 20% 0px`,
            threshold: [0, 0.1, 0.2]  // Multiple thresholds for smoother detection
        });
        
        // Observe each service card
        serviceCards.forEach(card => {
            cardObserver.observe(card);
        });
        
        // Cleanup when window resizes above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                serviceCards.forEach(card => {
                    cardObserver.unobserve(card);
                    card.classList.remove('in-view');
                });
            }
        });
    }
});

// Modal functionality - updated with scroll position preservation
let scrollPosition = 0;

function openModal() {
    // Store current scroll position before locking
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Apply modal open class
    document.querySelector('.modal').classList.add('active');
    document.body.classList.add('modal-open');
    
    // Set the scroll position as a negative top margin to preserve position
    document.body.style.top = `-${scrollPosition}px`;
}

function closeModal() {
    // Remove modal classes
    document.querySelector('.modal').classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Reset the body style
    document.body.style.top = '';
    
    // Restore scroll position
    window.scrollTo({
        top: scrollPosition,
        behavior: 'instant' // Use instant to avoid animation
    });
}

// Fix for Safari background stuttering issues
function applySafariBackgroundFixes() {
    // Detect iOS or Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isSafari || isIOS) {
        // Apply specific styles for Safari/iOS
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            /* Safari/iOS specific fixes for background stuttering */
            .hero, .tech, .who-we-help {
                background-attachment: scroll !important;
            }
            
            /* Use transform for hardware acceleration */
            .hero, .tech, .who-we-help {
                transform: translate3d(0, 0, 0);
                -webkit-transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            /* Improve video background performance */
            .video-background {
                transform: translate3d(0, 0, 0);
                -webkit-transform: translate3d(0, 0, 0);
            }
        `;
        document.head.appendChild(styleEl);
        
        // Add a class to body for potential CSS targeting
        document.body.classList.add('safari-browser');
    }
}

// Enhanced cross-browser compatibility and performance optimizations
function applyBrowserOptimizations() {
    // 1. Detect browsers and platforms
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isEdge = navigator.userAgent.indexOf("Edg") > -1;
    const isOldEdge = navigator.userAgent.indexOf("Edge") > -1;
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    
    // 2. Apply browser-specific classes to the body for CSS targeting
    const html = document.documentElement;
    const body = document.body;
    
    if (isSafari || isIOS) body.classList.add('safari-browser');
    if (isFirefox) body.classList.add('firefox-browser');
    if (isEdge) body.classList.add('edge-browser');
    if (isOldEdge) body.classList.add('old-edge-browser');
    if (isIE) body.classList.add('ie-browser');
    
    // 3. Create browser-specific styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* Common performance optimizations for all browsers */
        .hero, .tech, .who-we-help, .video-background, .showcase-item, .fleet-tile, .tech-tile {
            will-change: opacity, transform;
            contain: content;
        }
        
        /* Safari/iOS specific fixes */
        .safari-browser .hero, 
        .safari-browser .tech, 
        .safari-browser .who-we-help {
            background-attachment: scroll !important;
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        
        /* Firefox-specific fixes */
        .firefox-browser .hero,
        .firefox-browser .tech,
        .firefox-browser .who-we-help {
            background-attachment: fixed;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
        }
        
        /* Edge/IE fixes */
        .edge-browser .video-background,
        .old-edge-browser .video-background,
        .ie-browser .video-background {
            object-fit: cover;
            font-family: 'object-fit: cover';
        }
    `;
    document.head.appendChild(styleEl);
    
    // 4. Detect low performance devices
    const isLowEndDevice = () => {
        // Check for low memory (approximation)
        if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
        
        // Check for slow CPU (approximation)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
        
        return false;
    };
    
    // 5. Apply optimizations for low-end devices
    if (isLowEndDevice()) {
        body.classList.add('low-end-device');
        
        // Reduce animation complexity for low-end devices
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            .low-end-device * {
                transition-duration: 0.1s !important;
                animation-duration: 0.1s !important;
            }
            
            .low-end-device .video-background {
                display: none;
            }
            
            .low-end-device .hero {
                background-attachment: scroll !important;
            }
        `;
        document.head.appendChild(additionalStyles);
    }
    
    // 6. Apply throttling to high-frequency events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Apply throttled resize handler
    const originalResizeHandlers = window.onresize;
    window.onresize = throttle(function(e) {
        if (typeof originalResizeHandlers === 'function') {
            originalResizeHandlers(e);
        }
    }, 100);
    
    // 7. Optimize image loading
    if ('loading' in HTMLImageElement.prototype) {
        // Use native lazy loading if available
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading && !img.classList.contains('critical')) {
                img.loading = 'lazy';
            }
        });
    }
}