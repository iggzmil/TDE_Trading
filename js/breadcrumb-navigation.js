/**
 * Breadcrumb Navigation with Schema Markup
 * Automatically generates breadcrumb navigation for better UX and SEO
 */

(function() {
    'use strict';

    // Page hierarchy configuration
    const pageHierarchy = {
        'index.html': {
            title: 'Home',
            parent: null
        },
        'pricing.html': {
            title: 'Pricing',
            parent: 'index.html'
        },
        'testimonial.html': {
            title: 'Testimonials',
            parent: 'index.html'
        },
        'contact.html': {
            title: 'Contact',
            parent: 'index.html'
        },
        'faqs.html': {
            title: 'FAQs',
            parent: 'index.html'
        },
        'selection-monthly.html': {
            title: 'Monthly Plan',
            parent: 'pricing.html'
        },
        'selection-yearly.html': {
            title: 'Yearly Plan',
            parent: 'pricing.html'
        },
        'payment-monthly.html': {
            title: 'Monthly Payment',
            parent: 'selection-monthly.html'
        },
        'payment-yearly.html': {
            title: 'Yearly Payment',
            parent: 'selection-yearly.html'
        },
        'payment-success.html': {
            title: 'Payment Success',
            parent: null,
            hidden: true
        },
        'payment-cancelled.html': {
            title: 'Payment Cancelled',
            parent: null,
            hidden: true
        },
        'disclaimer.html': {
            title: 'Disclaimer',
            parent: 'index.html'
        },
        'privacy-policy.html': {
            title: 'Privacy Policy',
            parent: 'index.html'
        },
        'terms-conditions.html': {
            title: 'Terms & Conditions',
            parent: 'index.html'
        }
    };

    /**
     * Get current page filename
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return filename;
    }

    /**
     * Build breadcrumb trail
     */
    function buildBreadcrumbTrail(currentPage) {
        const trail = [];
        let page = currentPage;

        // Build trail from current page to home
        while (page && pageHierarchy[page]) {
            const pageInfo = pageHierarchy[page];
            if (!pageInfo.hidden) {
                trail.unshift({
                    title: pageInfo.title,
                    url: page === 'index.html' ? '/' : '/' + page,
                    page: page
                });
            }
            page = pageInfo.parent;
        }

        // Always ensure home is first if not already
        if (trail.length === 0 || trail[0].page !== 'index.html') {
            trail.unshift({
                title: 'Home',
                url: '/',
                page: 'index.html'
            });
        }

        return trail;
    }

    /**
     * Generate breadcrumb HTML
     */
    function generateBreadcrumbHTML(trail) {
        if (trail.length <= 1) {
            return ''; // Don't show breadcrumbs on home page
        }

        let html = '<nav class="breadcrumb-navigation" aria-label="Breadcrumb">';
        html += '<ol class="breadcrumb">';

        trail.forEach((item, index) => {
            const isLast = index === trail.length - 1;
            
            if (isLast) {
                html += `<li class="breadcrumb-item active" aria-current="page">${item.title}</li>`;
            } else {
                html += `<li class="breadcrumb-item"><a href="${item.url}">${item.title}</a></li>`;
            }
        });

        html += '</ol>';
        html += '</nav>';

        return html;
    }

    /**
     * Generate schema markup for breadcrumbs
     */
    function generateBreadcrumbSchema(trail) {
        if (trail.length <= 1) {
            return null;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };

        trail.forEach((item, index) => {
            schema.itemListElement.push({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.title,
                "item": window.location.origin + item.url
            });
        });

        return schema;
    }

    /**
     * Insert breadcrumb CSS
     */
    function insertBreadcrumbStyles() {
        const styles = `
            .breadcrumb-navigation {
                padding: 15px 0;
                margin: 0;
                background: transparent;
            }
            
            .breadcrumb {
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                margin: 0;
                list-style: none;
                background: transparent;
                font-size: 14px;
            }
            
            .breadcrumb-item {
                display: flex;
                align-items: center;
                color: var(--text-color);
            }
            
            .breadcrumb-item + .breadcrumb-item::before {
                content: '/';
                padding: 0 10px;
                color: var(--text-color);
                opacity: 0.5;
            }
            
            .breadcrumb-item a {
                color: var(--primary-color);
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .breadcrumb-item a:hover {
                color: var(--accent-color);
                text-decoration: underline;
            }
            
            .breadcrumb-item.active {
                color: var(--text-color);
                font-weight: 500;
            }
            
            /* Dark background variant */
            .dark-bg .breadcrumb-item,
            .dark-bg .breadcrumb-item.active {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .dark-bg .breadcrumb-item a {
                color: var(--white-color);
            }
            
            .dark-bg .breadcrumb-item a:hover {
                color: var(--accent-color);
            }
            
            .dark-bg .breadcrumb-item + .breadcrumb-item::before {
                color: rgba(255, 255, 255, 0.5);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .breadcrumb {
                    font-size: 12px;
                }
                
                .breadcrumb-item + .breadcrumb-item::before {
                    padding: 0 5px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Insert breadcrumbs into page
     */
    function insertBreadcrumbs() {
        const currentPage = getCurrentPage();
        const trail = buildBreadcrumbTrail(currentPage);
        
        if (trail.length <= 1) {
            return; // No breadcrumbs for home page
        }

        // Generate HTML
        const breadcrumbHTML = generateBreadcrumbHTML(trail);
        
        // Find insertion point (after header, before main content)
        const insertionPoints = [
            '.general-header',
            '.page-header',
            '.inner-header',
            '.main-header'
        ];

        let inserted = false;
        for (const selector of insertionPoints) {
            const element = document.querySelector(selector);
            if (element) {
                // Create wrapper div
                const wrapper = document.createElement('div');
                wrapper.className = 'breadcrumb-wrapper';
                wrapper.innerHTML = `<div class="container">${breadcrumbHTML}</div>`;
                
                // Insert after the header element
                element.insertAdjacentElement('afterend', wrapper);
                inserted = true;
                break;
            }
        }

        // Fallback: insert at beginning of body
        if (!inserted) {
            const firstSection = document.querySelector('section, .content, main');
            if (firstSection) {
                const wrapper = document.createElement('div');
                wrapper.className = 'breadcrumb-wrapper';
                wrapper.innerHTML = `<div class="container">${breadcrumbHTML}</div>`;
                firstSection.insertAdjacentElement('beforebegin', wrapper);
            }
        }

        // Add schema markup
        const schema = generateBreadcrumbSchema(trail);
        if (schema) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        }
    }

    /**
     * Initialize breadcrumb navigation
     */
    function init() {
        // Insert styles
        insertBreadcrumbStyles();
        
        // Insert breadcrumbs when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertBreadcrumbs);
        } else {
            insertBreadcrumbs();
        }
    }

    // Initialize
    init();

})();

// Helper function to manually update breadcrumbs (can be called from other scripts)
window.updateBreadcrumbs = function(customTrail) {
    const breadcrumbWrapper = document.querySelector('.breadcrumb-wrapper');
    if (breadcrumbWrapper && customTrail) {
        const html = generateBreadcrumbHTML(customTrail);
        breadcrumbWrapper.innerHTML = `<div class="container">${html}</div>`;
    }
};