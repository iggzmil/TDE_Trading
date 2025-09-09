/**
 * Performance Optimizations for TDE Trading
 * Implements lazy loading, resource hints, and other performance improvements
 */

(function() {
    'use strict';

    // 1. Lazy Loading for Images
    function initLazyLoading() {
        // Check if native lazy loading is supported
        if ('loading' in HTMLImageElement.prototype) {
            // Use native lazy loading
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        } else {
            // Fallback to Intersection Observer
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // 2. Preload Critical Resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/bootstrap.min.css', as: 'style' },
            { href: '/css/custom.css', as: 'style' },
            { href: '/js/jquery-3.7.1.min.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Fustat:wght@200..800&display=swap', as: 'style', crossorigin: 'anonymous' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossorigin) {
                link.crossOrigin = resource.crossorigin;
            }
            document.head.appendChild(link);
        });
    }

    // 3. Defer Non-Critical CSS
    function deferNonCriticalCSS() {
        const nonCriticalStyles = [
            '/css/animate.css',
            '/css/magnific-popup.css',
            '/css/swiper-bundle.min.css'
        ];

        nonCriticalStyles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    // 4. Optimize Web Fonts Loading
    function optimizeFonts() {
        // Add font-display: swap to improve perceived performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Fustat';
                font-display: swap;
            }
            @font-face {
                font-family: 'flaticon_tde_trading';
                font-display: block;
            }
        `;
        document.head.appendChild(style);
    }

    // 5. Resource Hints
    function addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    // 6. Implement Prefetching for Navigation
    function prefetchPages() {
        // Only prefetch on good connections
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                return; // Don't prefetch on slow connections
            }
        }

        // Prefetch links on hover
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.href;
                if (!document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = href;
                    document.head.appendChild(prefetchLink);
                }
            });
        });
    }

    // 7. Optimize Scroll Performance
    function optimizeScroll() {
        let ticking = false;
        
        function updateScrollProgress() {
            // Update scroll-based animations or progress indicators
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        }

        // Throttle scroll events
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // 8. Progressive Image Loading with Blur-up Effect
    function progressiveImageLoading() {
        const progressiveImages = document.querySelectorAll('[data-progressive]');
        
        progressiveImages.forEach(img => {
            // Load low quality placeholder first
            const placeholder = new Image();
            placeholder.src = img.dataset.placeholder || img.src;
            placeholder.onload = function() {
                img.src = placeholder.src;
                img.classList.add('placeholder-loaded');
                
                // Then load high quality image
                const fullImage = new Image();
                fullImage.src = img.dataset.progressive;
                fullImage.onload = function() {
                    img.src = fullImage.src;
                    img.classList.add('progressive-loaded');
                    img.classList.remove('placeholder-loaded');
                };
            };
        });
    }

    // 9. Service Worker Registration for Offline Support
    function registerServiceWorker() {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered:', registration))
                    .catch(error => console.log('SW registration failed:', error));
            });
        }
    }

    // 10. Critical CSS Inlining Helper
    function inlineCriticalCSS() {
        // This would typically be done at build time
        // For now, we'll prioritize above-the-fold styles
        const criticalStyles = `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: var(--default-font); }
            .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 999999; }
            .main-header { position: relative; background: var(--primary-color); }
            .hero-section { min-height: 100vh; position: relative; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalStyles;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Initialize all optimizations
    function init() {
        // Run critical optimizations immediately
        optimizeFonts();
        addResourceHints();
        
        // Run other optimizations when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initLazyLoading();
                deferNonCriticalCSS();
                prefetchPages();
                optimizeScroll();
                progressiveImageLoading();
            });
        } else {
            initLazyLoading();
            deferNonCriticalCSS();
            prefetchPages();
            optimizeScroll();
            progressiveImageLoading();
        }
        
        // Register service worker after page load
        window.addEventListener('load', registerServiceWorker);
    }

    // Start optimizations
    init();

})();

// Performance Monitoring
(function() {
    'use strict';
    
    // Monitor Core Web Vitals
    function reportWebVitals(metric) {
        // Send to analytics or monitoring service
        console.log('Web Vital:', metric);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                value: Math.round(metric.value),
                metric_id: metric.id,
                metric_value: metric.value,
                metric_delta: metric.delta
            });
        }
    }
    
    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                reportWebVitals({
                    name: 'LCP',
                    value: lastEntry.renderTime || lastEntry.loadTime,
                    id: lastEntry.id
                });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            console.log('LCP observation not supported');
        }
    }
    
    // Monitor First Input Delay
    if ('PerformanceObserver' in window) {
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    reportWebVitals({
                        name: 'FID',
                        value: entry.processingStart - entry.startTime,
                        id: entry.name
                    });
                });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
            console.log('FID observation not supported');
        }
    }
})();