// Enhanced Animation System with Optimized Timing
// This file provides a unified approach to animations using GSAP with improved delay logic

// Initialize GSAP and ScrollTrigger with proper error handling
let gsapInitialized = false;

function initializeGSAP() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded - animations disabled');
        return false;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger not loaded - scroll animations disabled');
        return false;
    }

    try {
        gsap.registerPlugin(ScrollTrigger);
        gsapInitialized = true;
        return true;
    } catch (error) {
        console.error('Failed to initialize GSAP:', error);
        return false;
    }
}

// Optimized timing configuration for better UX
const animationConfig = {
    // Base timing settings
    baseDuration: 0.6,
    baseDelay: 0.15,
    maxDelay: 0.8, // Reduced from 1.4s max found in pages
    staggerIncrement: 0.12, // Reduced for faster sequential animations
    
    // Element-specific timing overrides
    elementTiming: {
        'service-item': { 
            baseDelay: 0.1, 
            stagger: 0.15,
            maxItems: 6 // Prevent excessive delays for service grids
        },
        'company-logo': { 
            baseDelay: 0.08, 
            stagger: 0.1,
            maxItems: 8 // Faster logo reveals
        },
        'client-testimonial-item': { 
            baseDelay: 0.1, 
            stagger: 0.12,
            maxItems: 6
        },
        'benefit-item': { 
            baseDelay: 0.12, 
            stagger: 0.15,
            maxItems: 4
        },
        'accordion-item': { 
            baseDelay: 0.1, 
            stagger: 0.08,
            maxItems: 10 // Faster FAQ reveals
        },
        'pricing-box': { 
            baseDelay: 0.15, 
            stagger: 0.2,
            maxItems: 3
        },
        'company-growth-item': { 
            baseDelay: 0.12, 
            stagger: 0.15,
            maxItems: 4 // 4 items in time tested approach section
        },
        'company-experience-item': { 
            baseDelay: 0.12, 
            stagger: 0.15,
            maxItems: 4 // 4 items in experience section
        }
    }
};

// Animation presets mapping with improved timing and easing
const animationPresets = {
  fadeIn: {
    opacity: 0,
    animation: { opacity: 1, duration: 0.7, ease: "power2.out" }
  },
  fadeInUp: {
    opacity: 0,
    y: 30, // Reduced from 40 for subtler effect
    animation: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
  },
  fadeInDown: {
    opacity: 0,
    y: -30, // Reduced from -40 for subtler effect
    animation: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
  },
  fadeInLeft: {
    opacity: 0,
    x: -30, // Reduced from -40 for subtler effect
    animation: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
  },
  fadeInRight: {
    opacity: 0,
    x: 30, // Reduced from 40 for subtler effect
    animation: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
  },
  zoomIn: {
    opacity: 0,
    scale: 0.9, // Changed from 0.85 for subtler effect
    animation: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.1)" }
  },
  bounceIn: {
    opacity: 0,
    scale: 0.7, // Changed from 0.5 for better effect
    animation: { opacity: 1, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" }
  },
  // Special animation for service-steps-box items
  serviceStepItem: {
    opacity: 0,
    y: 15, // Reduced from 20 for subtler effect
    scale: 0.98, // Increased from 0.97 for subtler effect
    animation: { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" }
  }
};

// Intelligent delay calculation based on element context
function calculateOptimalDelay(element, elementIndex = 0) {
    // Get element classes for context-aware timing
    const classList = Array.from(element.classList);
    
    // Check for manual delay override first
    const manualDelay = element.getAttribute('data-delay') || element.getAttribute('data-wow-delay');
    if (manualDelay) {
        const delayMatch = manualDelay.match(/^([\d.]+)s?$/);
        if (delayMatch) {
            const delay = parseFloat(delayMatch[1]);
            // Cap manual delays to prevent excessive waits
            return Math.min(delay, animationConfig.maxDelay);
        }
    }
    
    // Find element type for timing configuration
    let elementType = null;
    let configKey = null;
    
    for (const [key, config] of Object.entries(animationConfig.elementTiming)) {
        if (classList.some(cls => cls.includes(key.replace('-', '-')))) {
            elementType = key;
            configKey = key;
            break;
        }
    }
    
    // Use element-specific timing if found
    if (configKey && animationConfig.elementTiming[configKey]) {
        const config = animationConfig.elementTiming[configKey];
        const calculatedDelay = config.baseDelay + (elementIndex * config.stagger);
        
        // Cap delay based on maxItems to prevent excessive delays
        const maxDelay = config.baseDelay + ((config.maxItems - 1) * config.stagger);
        return Math.min(calculatedDelay, maxDelay, animationConfig.maxDelay);
    }
    
    // Default progressive delay calculation
    const baseDelay = animationConfig.baseDelay;
    const progressiveDelay = baseDelay + (elementIndex * animationConfig.staggerIncrement);
    
    return Math.min(progressiveDelay, animationConfig.maxDelay);
}

// Initialize animations for elements with animation classes
function initScrollAnimations() {
  // Only proceed if GSAP is properly initialized
  if (!gsapInitialized && !initializeGSAP()) {
    console.warn('Scroll animations disabled - GSAP initialization failed');
    return;
  }

  // Enhanced handling for service-step-item elements in service-steps-box
  const serviceStepItems = document.querySelectorAll('.service-steps-box .service-step-item');
  if (serviceStepItems.length > 0) {
    // Get the parent container for all service step items
    const container = serviceStepItems[0].closest('.service-steps-box');

    // Create an array of items that haven't been processed yet
    const unprocessedItems = Array.from(serviceStepItems).filter(item => !item.hasAttribute('data-animation-processed'));

    if (unprocessedItems.length > 0) {
      // Mark all items as processed
      unprocessedItems.forEach(item => {
        item.setAttribute('data-animation-processed', 'true');
      });

      // Apply the special service step animation
      const preset = animationPresets['serviceStepItem'];

      // Apply initial state to all items at once (better performance)
      gsap.set(unprocessedItems, preset);

      // Create a single ScrollTrigger for the entire container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
          markers: false
        }
      });

      // Add all items to the timeline with optimized staggered animation
      tl.to(unprocessedItems, {
        ...preset.animation,
        stagger: 0.06, // Reduced from 0.08 for faster overall animation
        ease: "power2.out",
        clearProps: "transform", // Clean up transform properties after animation
        onComplete: function() {}
      });
    }
  }

  // Group elements by their container/section for better timing coordination
  const elementGroups = new Map();
  
  // Find all elements with animation classes, including those with 'wow' class
  const animationElements = document.querySelectorAll('.fadeIn, .fadeInUp, .fadeInDown, .fadeInLeft, .fadeInRight, .zoomIn, .bounceIn, .wow');

  // Group elements by their parent section for coordinated timing
  animationElements.forEach(element => {
    if (element.hasAttribute('data-animation-processed')) {
      return;
    }

    // Skip service-step-items as they're handled separately
    if (element.classList.contains('service-step-item') && element.closest('.service-steps-box')) {
      return;
    }

    // Find the parent section or container
    const section = element.closest('section, .about-us, .our-service, .our-potential, .our-approach, .our-partners, .how-we-work, .company-growth, .our-testimonial, .page-contact-us, .page-pricing, .tde-benefits');
    const groupKey = section ? section.className || 'default' : 'default';
    
    if (!elementGroups.has(groupKey)) {
      elementGroups.set(groupKey, []);
    }
    elementGroups.get(groupKey).push(element);
  });

  // Process each group with optimized timing
  elementGroups.forEach((elements, groupKey) => {
    elements.forEach((element, index) => {
      // Skip elements that have already been processed
      if (element.hasAttribute('data-animation-processed')) {
        return;
      }

      // Mark element as processed to avoid duplicate animations
      element.setAttribute('data-animation-processed', 'true');

      // Determine animation type from class names
      const classes = Array.from(element.classList);
      let animationType = classes.find(cls => animationPresets[cls]);

      // Handle elements with 'wow' class
      if (!animationType && classes.includes('wow')) {
        // Check for fadeIn, fadeUp, etc. in the class list
        if (classes.includes('fadeInUp')) animationType = 'fadeInUp';
        else if (classes.includes('fadeIn')) animationType = 'fadeIn';
        else if (classes.includes('fadeInDown')) animationType = 'fadeInDown';
        else if (classes.includes('fadeInLeft')) animationType = 'fadeInLeft';
        else if (classes.includes('fadeInRight')) animationType = 'fadeInRight';
        else if (classes.includes('zoomIn')) animationType = 'zoomIn';
        else if (classes.includes('bounceIn')) animationType = 'bounceIn';
        else animationType = 'fadeIn'; // Default animation for 'wow' class
      }

      if (!animationType) return;

      // Get animation settings
      const preset = animationPresets[animationType];
      if (!preset) return;

      // Calculate optimal delay for this element
      const delay = calculateOptimalDelay(element, index);

      // Get duration if specified
      let duration = preset.animation.duration;
      const durationAttr = element.getAttribute('data-duration') || element.getAttribute('data-wow-duration');
      if (durationAttr) {
        const durationMatch = durationAttr.match(/^([\d.]+)s?$/);
        if (durationMatch) {
          duration = parseFloat(durationMatch[1]);
        }
      }

      // Get iteration count if specified
      let repeat = 0; // 0 means play once (no repeat)
      const iterationAttr = element.getAttribute('data-iteration');
      if (iterationAttr) {
        repeat = parseInt(iterationAttr) - 1; // GSAP repeat is 0-based
        if (isNaN(repeat) || repeat < 0) {
          repeat = 0;
        }
      }

      // Apply initial state
      gsap.set(element, preset);

      // Create ScrollTrigger animation with improved trigger settings
      gsap.to(element, {
        ...preset.animation,
        duration: duration,
        delay: delay,
        repeat: repeat,
        scrollTrigger: {
          trigger: element,
          start: "top 85%", // Trigger earlier (when element is 15% into the viewport)
          toggleActions: "play none none none", // Play animation once when enters viewport
          once: true // Ensure animation only plays once
        }
      });
    });
  });
}

// Function to handle animations for dynamically added content
function refreshAnimations() {
  // Check for new service-step-item elements
  const newServiceStepItems = document.querySelectorAll('.service-steps-box .service-step-item:not([data-animation-processed])');

  // Find all other elements that haven't been processed yet
  const newElements = document.querySelectorAll('.fadeIn:not([data-animation-processed]), .fadeInUp:not([data-animation-processed]), .fadeInDown:not([data-animation-processed]), .fadeInLeft:not([data-animation-processed]), .fadeInRight:not([data-animation-processed]), .zoomIn:not([data-animation-processed]), .bounceIn:not([data-animation-processed]), .wow:not([data-animation-processed])');

  if (newServiceStepItems.length > 0 || newElements.length > 0) {
    initScrollAnimations();
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initial animation setup
  initScrollAnimations();

  // Set up a MutationObserver to detect new content
  const observer = new MutationObserver(function(mutations) {
    let needsRefresh = false;

    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes have animation classes
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (
              node.classList &&
              (node.classList.contains('fadeIn') ||
               node.classList.contains('fadeInUp') ||
               node.classList.contains('fadeInDown') ||
               node.classList.contains('fadeInLeft') ||
               node.classList.contains('fadeInRight') ||
               node.classList.contains('zoomIn') ||
               node.classList.contains('bounceIn') ||
               node.classList.contains('wow'))
            ) {
              needsRefresh = true;
            } else if (node.querySelector) {
              // Check for animation classes in children
              const hasAnimatedChildren = node.querySelector('.fadeIn, .fadeInUp, .fadeInDown, .fadeInLeft, .fadeInRight, .zoomIn, .bounceIn, .wow');
              if (hasAnimatedChildren) {
                needsRefresh = true;
              }
            }
          }
        });
      }
    });

    if (needsRefresh) {
      // Debounce the refresh to avoid multiple calls
      clearTimeout(window.animationRefreshTimeout);
      window.animationRefreshTimeout = setTimeout(refreshAnimations, 100);
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
});

// For dynamic content or single-page applications
// Export function to be called after content updates
window.initScrollAnimations = initScrollAnimations;
window.refreshAnimations = refreshAnimations;

// Backward compatibility for any code that might expect the old API
window.syncAnimations = initScrollAnimations;