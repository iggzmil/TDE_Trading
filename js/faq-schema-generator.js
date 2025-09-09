/**
 * FAQ Schema Markup Generator
 * Automatically generates structured data for FAQ pages to improve SEO
 */

(function() {
    'use strict';

    /**
     * Extract FAQ data from the page
     */
    function extractFAQData() {
        const faqs = [];
        
        // Look for accordion items (Bootstrap pattern)
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach(item => {
            const questionElement = item.querySelector('.accordion-button');
            const answerElement = item.querySelector('.accordion-body');
            
            if (questionElement && answerElement) {
                const question = questionElement.textContent.trim();
                const answer = answerElement.textContent.trim();
                
                if (question && answer) {
                    faqs.push({
                        question: question,
                        answer: answer
                    });
                }
            }
        });
        
        // Alternative pattern: FAQ lists
        if (faqs.length === 0) {
            const faqContainers = document.querySelectorAll('.faq-item, .qa-item, [itemtype*="Question"]');
            
            faqContainers.forEach(container => {
                const question = container.querySelector('.question, h3, h4, [itemprop="name"]');
                const answer = container.querySelector('.answer, p, [itemprop="acceptedAnswer"]');
                
                if (question && answer) {
                    faqs.push({
                        question: question.textContent.trim(),
                        answer: answer.textContent.trim()
                    });
                }
            });
        }
        
        return faqs;
    }

    /**
     * Generate FAQ schema markup
     */
    function generateFAQSchema(faqs) {
        if (faqs.length === 0) {
            return null;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };

        faqs.forEach(faq => {
            schema.mainEntity.push({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            });
        });

        return schema;
    }

    /**
     * Generate How-To schema for trading education content
     */
    function generateHowToSchema() {
        // Check if page contains how-to content
        const howToIndicators = [
            'how to trade',
            'how do you',
            'step-by-step',
            'guide to',
            'learn to trade'
        ];
        
        const pageContent = document.body.textContent.toLowerCase();
        const hasHowTo = howToIndicators.some(indicator => pageContent.includes(indicator));
        
        if (!hasHowTo) {
            return null;
        }

        const howToSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Start Trading with TDE Trading",
            "description": "Learn professional trading strategies for Forex, Crypto, Commodities, and Indices with expert mentorship",
            "image": {
                "@type": "ImageObject",
                "url": "https://www.tdetrading.com.au/images/TDE-Trading-logo.png"
            },
            "totalTime": "PT30D",
            "estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "AUD",
                "value": "99"
            },
            "supply": {
                "@type": "HowToSupply",
                "name": "Trading Account and Platform Access"
            },
            "tool": [
                {
                    "@type": "HowToTool",
                    "name": "TradingView or MetaTrader Platform"
                },
                {
                    "@type": "HowToTool",
                    "name": "Risk Calculator"
                }
            ],
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Join TDE Trading",
                    "text": "Sign up for TDE Trading membership to access educational resources and mentorship",
                    "url": "https://www.tdetrading.com.au/pricing.html"
                },
                {
                    "@type": "HowToStep",
                    "name": "Learn Smart Money Concepts",
                    "text": "Master institutional trading strategies and market structure analysis",
                    "url": "https://www.tdetrading.com.au/"
                },
                {
                    "@type": "HowToStep",
                    "name": "Practice Risk Management",
                    "text": "Implement proper position sizing and stop-loss strategies",
                    "url": "https://www.tdetrading.com.au/faqs.html"
                },
                {
                    "@type": "HowToStep",
                    "name": "Join Live Trading Sessions",
                    "text": "Participate in live market analysis and trading sessions with mentors",
                    "url": "https://www.tdetrading.com.au/contact.html"
                }
            ]
        };

        return howToSchema;
    }

    /**
     * Generate Q&A schema for specific trading questions
     */
    function generateQASchema() {
        const qaSchema = {
            "@context": "https://schema.org",
            "@type": "QAPage",
            "mainEntity": {
                "@type": "Question",
                "name": "What is TDE Trading and how can it help me become a successful trader?",
                "text": "I want to learn professional trading strategies for Forex, Crypto, and other markets.",
                "answerCount": 1,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "TDE Trading provides comprehensive trading education through expert mentorship, focusing on Smart Money Concepts and institutional trading strategies. Our program covers Forex, Crypto, Commodities, and Indices trading with emphasis on risk management and practical application. Members get access to live trading sessions, educational resources, and continuous support from experienced traders.",
                    "author": {
                        "@type": "Organization",
                        "name": "TDE Trading"
                    }
                }
            }
        };

        return qaSchema;
    }

    /**
     * Insert schema into page
     */
    function insertSchema(schema, type = 'FAQPage') {
        if (!schema) {
            return;
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `schema-${type}`;
        script.textContent = JSON.stringify(schema, null, 2);
        
        // Remove existing schema of same type if present
        const existingSchema = document.getElementById(`schema-${type}`);
        if (existingSchema) {
            existingSchema.remove();
        }
        
        document.head.appendChild(script);
        
        console.log(`${type} Schema Markup added successfully`);
    }

    /**
     * Initialize FAQ schema generation
     */
    function init() {
        // Check if we're on the FAQ page
        const isFAQPage = window.location.pathname.includes('faq') || 
                         document.title.toLowerCase().includes('faq') ||
                         document.querySelector('.faq-section, .faqs-section, #faqs');
        
        if (isFAQPage) {
            // Extract and generate FAQ schema
            const faqs = extractFAQData();
            const faqSchema = generateFAQSchema(faqs);
            
            if (faqSchema) {
                insertSchema(faqSchema, 'FAQPage');
                
                // Also add Q&A schema for additional coverage
                const qaSchema = generateQASchema();
                insertSchema(qaSchema, 'QAPage');
            }
            
            // Add How-To schema if applicable
            const howToSchema = generateHowToSchema();
            if (howToSchema) {
                insertSchema(howToSchema, 'HowTo');
            }
        }
        
        // Add generic Q&A schema for other pages with questions
        const hasQuestions = document.querySelector('.accordion, .qa-section, .questions');
        if (hasQuestions && !isFAQPage) {
            const qaSchema = generateQASchema();
            insertSchema(qaSchema, 'QAPage');
        }
    }

    /**
     * Wait for DOM to be ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        setTimeout(init, 100); // Small delay to ensure accordions are rendered
    }

})();

// Manual function to add custom FAQ schema
window.addFAQSchema = function(faqs) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
};