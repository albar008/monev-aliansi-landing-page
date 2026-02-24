document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Smooth scroll with offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize FancyBox with correct options
    Fancybox.bind('[data-fancybox="gallery"]', {
        groupAll: true,
        infinite: true,
        showNavArrows: true,
        close: true,
        captions: {
            display: ['counter', 'caption']
        },
        toolbar: {
            display: {
                left: ['infobar'],
                middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
                right: ['slideshow', 'thumbs', 'close']
            }
        },
        slideshow: {
            autoplay: false,
            speed: 3000
        },
        Thumbs: false,
        on: {
            'initCarousel': (fancybox) => {
                console.log('Fancybox initialized');
            }
        }
    });
    
    // Handle button clicks within gallery items
    const galleryButtons = document.querySelectorAll('.gallery-caption button');
    galleryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Trigger click on the parent anchor
            const parentAnchor = button.closest('a');
            if (parentAnchor) {
                parentAnchor.click();
            }
        });
    });
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    // Function to start counting animation
    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        
        const updateCount = () => {
            const count = +counter.innerText;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    };
    
    // Using Intersection Observer to trigger counting when stats section is in view
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is in view
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    // Only start counting if it hasn't been counted yet
                    if (counter.innerText === '0') {
                        startCounting(counter);
                    }
                });
                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Find the stats section and observe it
    const statsSection = document.querySelector('section:has(.counter)');
    if (statsSection) {
        observer.observe(statsSection);
    } else {
        // Fallback: Find any section containing counter elements
        const allSections = document.querySelectorAll('section');
        allSections.forEach(section => {
            if (section.querySelector('.counter')) {
                observer.observe(section);
                return; // Stop after finding the first section with counters
            }
        });
    }
    
    // Cookie Consent Management
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    // Check if user already made a choice
    if (cookieConsent) {
      console.log('Checking cookie consent status...', cookieConsent, getCookie('cookie-consent'));
        if (!getCookie('cookie-consent')) {
            // Show cookie consent if no choice made
            cookieConsent.classList.remove('opacity-0');
            cookieConsent.classList.remove('invisible');
        } else {
            // Hide if already accepted/declined
            cookieConsent.classList.add('opacity-0');
            hideCookieConsent();
        }
        
        // Accept button click handler
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                setCookie('cookie-consent', 'accepted', 365);
                hideCookieConsent();
            });
        }
        
        // Decline button click handler
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                setCookie('cookie-consent', 'declined', 365);
                hideCookieConsent();
            });
        }
    }
});

// Cookie helper functions
function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('opacity-1');
        cookieConsent.classList.add('opacity-0');
    }
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}