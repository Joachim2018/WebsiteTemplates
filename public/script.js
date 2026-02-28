/**
 * WebTemplates - Interactive Features
 * Includes slider functionality and search
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSlider();
    initSearch();
});

/**
 * Image Slider Functionality
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds
    
    // Create dots if they don't exist
    if (dotsContainer && dotsContainer.children.length === 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Show current slide
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        const dots = document.querySelectorAll('.slider-dots .dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Auto-play interval
    function startInterval() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }
    
    // Reset interval on manual navigation
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Start auto-play
    startInterval();
    
    // Pause on hover
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startInterval);
    }
}

/**
 * Search Functionality
 */
function initSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-container button');
    
    if (!searchInput || !searchBtn) return;
    
    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search (debounced)
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (searchInput.value.length >= 2) {
                performSearch();
            }
        }, 300);
    });
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            // Show all content if query is empty
            resetSearch();
            return;
        }
        
        // Searchable elements
        const searchableElements = document.querySelectorAll('h1, h2, h3, p, .card, .contributor, .caption');
        
        let resultsFound = false;
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                resultsFound = true;
                
                // Highlight matching text
                if (!element.classList.contains('caption') && 
                    !element.classList.contains('card') && 
                    !element.classList.contains('contributor')) {
                    highlightText(element, query);
                }
                
                // Show parent elements if hidden
                showElement(element);
            } else {
                // Optionally hide non-matching elements
                // element.style.display = 'none';
            }
        });
        
        // Show results message
        if (!resultsFound) {
            showNoResultsMessage(query);
        } else {
            hideNoResultsMessage();
        }
    }
    
    function highlightText(element, query) {
        // Skip if already highlighted
        if (element.querySelector('.search-highlight')) return;
        
        const text = element.innerHTML;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function resetSearch() {
        // Remove highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        
        hideNoResultsMessage();
    }
    
    function showElement(element) {
        element.style.display = '';
        // Ensure parent elements are visible
        let parent = element.parentElement;
        while (parent) {
            if (parent.style) {
                parent.style.display = '';
            }
            parent = parent.parentElement;
        }
    }
    
    function showNoResultsMessage(query) {
        let noResults = document.querySelector('.no-results');
        
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            
            // Find a suitable container to add the message
            const container = document.querySelector('.container') || document.body;
            container.appendChild(noResults);
        }
        
        noResults.innerHTML = `
            <h3>No results found for "${query}"</h3>
            <p>Try searching for different keywords like "template", "business", "contact", or "contributor"</p>
        `;
        noResults.style.display = 'block';
    }
    
    function hideNoResultsMessage() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

/**
 * Smooth Scroll for Navigation
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/**
 * WhatsApp Link Handler
 */
function initWhatsApp() {
    const whatsappLinks = document.querySelectorAll('.whatsapp');
    
    whatsappLinks.forEach(link => {
        // Add phone number - replace with actual number
        const phoneNumber = '1234567890'; // Replace with actual number
        const message = encodeURIComponent('Hello! I\'m interested in your web templates.');
        link.href = `https://wa.me/${phoneNumber}?text=${message}`;
    });
}

// Initialize WhatsApp functionality
initWhatsApp();
