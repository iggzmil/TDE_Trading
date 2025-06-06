(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$(window).on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	if($("a[href='#top']").length){
		$("a[href='#top']").click(function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Hero Slider Layout JS */
	const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
		slidesPerView : 1,
		speed: 1000,
		spaceBetween: 0,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		pagination: {
			el: '.hero-pagination',
			clickable: true,
		},
	});

	/* testimonial Slider JS */
	$(document).ready(function() {
		// Wait a bit for all scripts to load
		setTimeout(function() {
			if (typeof Swiper !== 'undefined' && $('.testimonial-slider .swiper').length > 0) {
				try {
					const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
						slidesPerView: 1,
						speed: 1000,
						spaceBetween: 30,
						loop: true,
						autoplay: {
							delay: 5000,
							disableOnInteraction: false,
						},
						pagination: {
							el: '.testimonial-pagination',
							clickable: true,
						},
						navigation: {
							nextEl: '.testimonial-button-next',
							prevEl: '.testimonial-button-prev',
						},
						allowTouchMove: true,
						grabCursor: true,
						watchOverflow: true,
						observer: true,
						observeParents: true,
					});
				} catch (error) {
					// Testimonial slider initialization failed - continuing without error
				}
			}
		}, 500);
	});

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Youtube Background Video JS - Removed: No herovideo element found */
	// YTPlayer functionality disabled - element not in use

	/* Init Counter - CounterUp plugin removed as per project requirements */
	// Counter functionality disabled - plugin not included in project

	/* SlickNav Mobile Menu - Plugin removed as per project requirements */
	// SlickNav functionality disabled - plugin not included in project

	/* Custom Mobile Menu Implementation */
	$(document).ready(function() {
		// Initialize custom mobile menu
		initCustomMobileMenu();
	});

	function initCustomMobileMenu() {
		const $navbarToggle = $('.navbar-toggle');
		const $responsiveMenu = $('.responsive-menu');
		const $mainMenu = $('.main-menu');
		const $menu = $('#menu');

		// Create mobile menu structure
		createMobileMenuStructure();

		// Add click handler for mobile menu toggle
		$navbarToggle.on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			toggleMobileMenu();
		});

		// Add click handler for close button
		$(document).on('click', '.mobile-menu-close', function(e) {
			e.preventDefault();
			e.stopPropagation();
			closeMobileMenu();
		});

		// Close menu when clicking outside
		$(document).on('click', function(e) {
			if (!$(e.target).closest('.mobile-menu, .navbar-toggle').length) {
				closeMobileMenu();
			}
		});

		// Close menu when clicking on links
		$(document).on('click', '.mobile-menu-link, .mobile-cta-btn', function() {
			setTimeout(closeMobileMenu, 150); // Small delay for better UX
		});

		// Handle window resize
		$(window).on('resize', function() {
			if ($(window).width() > 991) {
				closeMobileMenu();
			}
		});

		// Handle escape key
		$(document).on('keydown', function(e) {
			if (e.key === 'Escape') {
				closeMobileMenu();
			}
		});

		// Handle keyboard navigation within mobile menu
		$(document).on('keydown', '.mobile-menu', function(e) {
			const $focusableElements = $('.mobile-menu').find('.mobile-menu-close, .mobile-menu-link, .mobile-cta-btn');
			const $currentFocus = $(document.activeElement);
			const currentIndex = $focusableElements.index($currentFocus);

			if (e.key === 'Tab') {
				if (e.shiftKey) {
					// Shift+Tab (reverse)
					if (currentIndex <= 0) {
						e.preventDefault();
						$focusableElements.last().focus();
					}
				} else {
					// Tab (forward)
					if (currentIndex >= $focusableElements.length - 1) {
						e.preventDefault();
						$focusableElements.first().focus();
					}
				}
			}
		});
	}

	function createMobileMenuStructure() {
		const $navbarToggle = $('.navbar-toggle');
		const $menu = $('#menu');

		// Clear existing content from navbar-toggle
		$navbarToggle.empty();

		// Create hamburger button directly in navbar-toggle
		const $hamburgerBtn = $('<button class="mobile-menu-btn navbar-hamburger" aria-label="Toggle navigation menu" aria-expanded="false"></button>');
		$hamburgerBtn.html(`
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
		`);

		// Create mobile menu
		const $mobileMenu = $('<nav class="mobile-menu" role="navigation" aria-label="Mobile navigation"></nav>');
		
		// Create close button
		const $closeBtn = $('<button class="mobile-menu-close" aria-label="Close navigation menu">&times;</button>');
		
		// Create mobile menu list
		const $mobileMenuList = $('<ul class="mobile-menu-list"></ul>');

		// Clone menu items from main menu
		$menu.find('li').each(function() {
			const $originalItem = $(this);
			const $link = $originalItem.find('a').first();
			const href = $link.attr('href');
			const text = $link.text().trim();

			const $mobileItem = $('<li class="mobile-menu-item"></li>');
			const $mobileLink = $(`<a href="${href}" class="mobile-menu-link">${text}</a>`);
			
			$mobileItem.append($mobileLink);
			$mobileMenuList.append($mobileItem);
		});

		// Add get in touch button as last menu item
		const $ctaItem = $('<li class="mobile-menu-item mobile-cta-item"></li>');
		const $ctaBtn = $('<a href="contact.html" class="btn-default mobile-cta-btn">get in touch</a>');
		$ctaItem.append($ctaBtn);
		$mobileMenuList.append($ctaItem);

		// Assemble mobile menu
		$mobileMenu.append($closeBtn);
		$mobileMenu.append($mobileMenuList);
		
		// Add hamburger button to navbar-toggle and mobile menu to body
		$navbarToggle.append($hamburgerBtn);
		$('body').append($mobileMenu);
	}

	function toggleMobileMenu() {
		const $body = $('body');
		const $mobileMenu = $('.mobile-menu');
		const $hamburgerBtn = $('.mobile-menu-btn, .navbar-hamburger');

		if ($body.hasClass('mobile-menu-open')) {
			closeMobileMenu();
		} else {
			openMobileMenu();
		}
	}

	function openMobileMenu() {
		const $body = $('body');
		const $hamburgerBtn = $('.mobile-menu-btn, .navbar-hamburger');
		const $mobileMenu = $('.mobile-menu');

		$mobileMenu.addClass('menu-open');
		$hamburgerBtn.addClass('menu-active').attr('aria-expanded', 'true');
		$body.addClass('mobile-menu-open');
		
		// Animate menu items
		$mobileMenu.find('.mobile-menu-item').each(function(index) {
			const $item = $(this);
			setTimeout(function() {
				$item.addClass('animate-in');
			}, index * 50);
		});

		// Focus management for accessibility
		$mobileMenu.find('.mobile-menu-close').focus();
	}

	function closeMobileMenu() {
		const $body = $('body');
		const $mobileMenu = $('.mobile-menu');
		const $hamburgerBtn = $('.mobile-menu-btn, .navbar-hamburger');
		const $mobileMenuItems = $('.mobile-menu-item');

		$mobileMenu.removeClass('menu-open');
		$hamburgerBtn.removeClass('menu-active').attr('aria-expanded', 'false');
		$body.removeClass('mobile-menu-open');
		$mobileMenuItems.removeClass('animate-in');
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot - Removed: No gallery-items elements found */
	// Magnific Popup functionality disabled - elements not in use

	/* Contact form validation */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-process.php",
			data: $contactform.serialize(),
			success : function(text){
				if (text == "success"){
					formSuccess();
				} else {
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Appointment form validation */
	var $appointmentForm = $("#appointmentForm");
	$appointmentForm.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitappointmentForm();
		}
	});

	function submitappointmentForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-appointment.php",
			data: $appointmentForm.serialize(),
			success : function(text){
				if (text == "success"){
					appointmentformSuccess();
				} else {
					appointmentsubmitMSG(false,text);
				}
			}
		});
	}

	function appointmentformSuccess(){
		$appointmentForm[0].reset();
		appointmentsubmitMSG(true, "Message Sent Successfully!")
	}

	function appointmentsubmitMSG(valid, msg){
		if(valid){
			var msgClasses = "h3 text-success";
		} else {
			var msgClasses = "h3 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Appointment form validation end */

	/* Animated Wow Js - Removed: Replaced by scrollAnimations.js */
	// WOW.js functionality replaced by GSAP-based scrollAnimations.js

	/* Popup Video - Removed: No popup-video elements found */
	// Popup video functionality disabled - elements not in use

	/* Back to Top Button Functionality */
	function initBackToTop() {
		// Create back to top button
		const $backToTopBtn = $('<a href="#" class="back-to-top" aria-label="Back to top" role="button" tabindex="0"></a>');
		$('body').append($backToTopBtn);

		// Throttle scroll events for performance
		let isScrolling = false;
		let showThreshold = 500; // Show button after scrolling 500px
		let lastScrollTop = 0;

		function handleScroll() {
			if (!isScrolling) {
				window.requestAnimationFrame(function() {
					const scrollTop = $window.scrollTop();
					const documentHeight = $(document).height();
					const windowHeight = $window.height();
					const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

					// Show/hide button based on scroll position
					if (scrollTop > showThreshold) {
						if (!$backToTopBtn.hasClass('show')) {
							$backToTopBtn.addClass('show animate-in');
							setTimeout(() => $backToTopBtn.removeClass('animate-in'), 500);
						}
					} else {
						$backToTopBtn.removeClass('show animate-in');
					}

					// Add subtle opacity change based on scroll progress
					if (scrollTop > showThreshold) {
						const maxOpacity = 1;
						const minOpacity = 0.7;
						const opacity = Math.max(minOpacity, maxOpacity - (scrollPercent / 200));
						$backToTopBtn.css('opacity', scrollTop > showThreshold ? Math.max(opacity, minOpacity) : 0);
					}

					lastScrollTop = scrollTop;
					isScrolling = false;
				});
			}
			isScrolling = true;
		}

		// Smooth scroll to top function
		function scrollToTop(e) {
			e.preventDefault();
			
			// Add click feedback
			$backToTopBtn.addClass('clicked');
			setTimeout(() => $backToTopBtn.removeClass('clicked'), 150);

			// Smooth scroll animation
			$('html, body').animate({
				scrollTop: 0
			}, {
				duration: 800,
				easing: 'swing',
				complete: function() {
					// Focus management for accessibility
					if (document.activeElement === $backToTopBtn[0]) {
						$('body').focus();
					}
				}
			});
		}

		// Event listeners
		$window.on('scroll', handleScroll);
		$window.on('resize', function() {
			// Update threshold on resize
			showThreshold = $window.width() < 768 ? 300 : 500;
		});

		// Click and keyboard events
		$backToTopBtn.on('click', scrollToTop);
		$backToTopBtn.on('keydown', function(e) {
			// Handle Enter and Space keys for accessibility
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				scrollToTop(e);
			}
		});

		// Hide button when mobile menu is open
		$(document).on('click', '.navbar-toggle', function() {
			setTimeout(function() {
				if ($('body').hasClass('mobile-menu-open')) {
					$backToTopBtn.addClass('hide-for-menu');
				} else {
					$backToTopBtn.removeClass('hide-for-menu');
				}
			}, 100);
		});

		// Initial check on page load
		setTimeout(handleScroll, 100);
	}

	// Initialize back to top button when DOM is ready
	$(document).ready(function() {
		initBackToTop();
	});

	// Additional CSS for clicked state
	$('<style>')
		.prop('type', 'text/css')
		.html(`
			.back-to-top.clicked {
				transform: translateY(2px) scale(0.95) !important;
				transition: all 0.1s ease !important;
			}
			.back-to-top.hide-for-menu {
				opacity: 0 !important;
				visibility: hidden !important;
				pointer-events: none !important;
			}
		`)
		.appendTo('head');

	/* Global Chatbot Widget Functionality */
	// Check if we're on the contact page
	const isContactPage = window.location.pathname.includes('contact.html') || 
						 (window.location.pathname.endsWith('/') && window.location.pathname.includes('contact'));

	// Initialize global chatbot functionality
	function initGlobalChatbot() {
		// Don't create global chatbot if we're on contact page (it has its own full implementation)
		if (isContactPage) {
			// Check for auto-expand parameter on contact page
			checkForAutoExpand();
			return;
		}

		// Create chatbot elements for non-contact pages
		createGlobalChatbotElements();
	}

	// Check if chat should auto-expand on contact page
	function checkForAutoExpand() {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('chat') === 'open') {
			// Wait for the contact page chatbot to load, then auto-expand
			setTimeout(function() {
				if (window.tdeTradingChat && typeof window.tdeTradingChat.toggle === 'function') {
					window.tdeTradingChat.toggle();
				}
			}, 500);
		}
	}

	// Create global chatbot button and bubble for non-contact pages
	function createGlobalChatbotElements() {
		// Create chatbot button HTML
		const chatbotHTML = `
			<div class="tde-global-chatbot">
				<!-- Chat Button -->
				<div class="chatbot-button" id="globalChatbotBtn" role="button" tabindex="0" aria-label="Open chat support">
				</div>
				
				<!-- Chat Bubble -->
				<div class="chat-bubble" id="globalChatBubble">
					Questions about trading? Let's chat!
				</div>
			</div>
		`;

		// Add CSS styles
		const chatbotStyles = `
			<style>
				/* Global Chatbot Container */
				.tde-global-chatbot {
					position: fixed;
					z-index: 9999;
					pointer-events: none;
				}

				.tde-global-chatbot * {
					pointer-events: auto;
				}

				/* Chatbot Button - Mirror exact styling of contact page */
				.chatbot-button {
					position: fixed;
					right: 20px;
					bottom: 20px;
					width: 50px;
					height: 50px;
					background: linear-gradient(135deg, #019297 0%, #73ED7C 100%);
					border: none;
					border-radius: 50%;
					color: #ffffff;
					font-size: 20px;
					cursor: pointer;
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 4px 20px rgba(4, 42, 45, 0.3);
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					opacity: 1;
					visibility: visible;
					transform: translateY(0);
					text-decoration: none;
					outline: none;
				}

				.chatbot-button::before {
					content: '\\f122';
					font-family: 'flaticon_tde_trading';
					font-size: 32px;
					line-height: 1;
					transition: all 0.3s ease;
				}

				.chatbot-button:hover {
					background: linear-gradient(135deg, #73ED7C 0%, #019297 100%);
					box-shadow: 0 6px 25px rgba(115, 237, 124, 0.4);
					transform: translateY(-2px);
					color: #ffffff;
					text-decoration: none;
				}

				.chatbot-button:hover::before {
					transform: translateY(-2px);
				}

				.chatbot-button:active {
					transform: translateY(0) scale(0.95);
					transition: all 0.1s ease;
				}

				/* Focus state for accessibility */
				.chatbot-button:focus {
					outline: 2px solid #73ED7C;
					outline-offset: 3px;
					box-shadow: 0 6px 25px rgba(115, 237, 124, 0.4);
				}

				/* Chat Bubble - Always visible with same styling as contact page */
				.chat-bubble {
					position: fixed;
					right: 80px;
					bottom: 35px;
					background: linear-gradient(135deg, #019297 0%, #73ED7C 100%);
					color: #ffffff;
					padding: 12px 16px;
					border-radius: 20px;
					font-size: 14px;
					font-weight: 500;
					box-shadow: 0 4px 20px rgba(4, 42, 45, 0.3);
					z-index: 9998;
					opacity: 1;
					visibility: visible;
					transform: translateX(0);
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					cursor: pointer;
					white-space: nowrap;
					font-family: 'Fustat', sans-serif;
				}

				.chat-bubble::after {
					content: '';
					position: absolute;
					right: -8px;
					top: 50%;
					transform: translateY(-50%);
					width: 0;
					height: 0;
					border-left: 8px solid #73ED7C;
					border-top: 8px solid transparent;
					border-bottom: 8px solid transparent;
				}

				.chat-bubble:hover {
					background: linear-gradient(135deg, #73ED7C 0%, #019297 100%);
					box-shadow: 0 6px 25px rgba(115, 237, 124, 0.4);
					transform: translateX(-2px);
				}

				/* Responsive positioning - Mirror back-to-top exactly */
				@media only screen and (max-width: 1200px) {
					.chatbot-button {
						right: 15px;
						bottom: 15px;
						width: 46px;
						height: 46px;
						font-size: 18px;
					}
					
					.chatbot-button::before {
						font-size: 28px;
					}

					.chat-bubble {
						right: 70px;
						bottom: 28px;
						padding: 10px 14px;
						font-size: 13px;
					}
				}

				@media only screen and (max-width: 991px) {
					.chatbot-button {
						right: 15px;
						bottom: 20px;
						width: 48px;
						height: 48px;
					}

					.chat-bubble {
						right: 72px;
						bottom: 33px;
					}
				}

				@media only screen and (max-width: 767px) {
					.chatbot-button {
						right: 15px;
						bottom: 15px;
						width: 44px;
						height: 44px;
						font-size: 16px;
					}
					
					.chatbot-button::before {
						font-size: 26px;
					}

					.chat-bubble {
						display: none;
					}
				}

				@media only screen and (max-width: 480px) {
					.chatbot-button {
						right: 10px;
						bottom: 10px;
						width: 42px;
						height: 42px;
						font-size: 14px;
					}
					
					.chatbot-button::before {
						font-size: 24px;
					}

					.chat-bubble {
						right: 62px;
						bottom: 23px;
						padding: 8px 10px;
						font-size: 11px;
					}
				}

				/* High contrast mode support */
				@media (prefers-contrast: high) {
					.chatbot-button {
						background: #042A2D;
						border: 2px solid #ffffff;
					}
					
					.chatbot-button:hover {
						background: #73ED7C;
						color: #042A2D;
					}

					.chat-bubble {
						background: #042A2D;
						border: 2px solid #ffffff;
					}
				}

				/* Reduced motion support */
				@media (prefers-reduced-motion: reduce) {
					.chatbot-button {
						transition: opacity 0.3s ease;
						transform: none !important;
					}
					
					.chatbot-button:hover {
						transform: none !important;
					}
					
					.chatbot-button::before {
						transition: none;
						transform: none !important;
					}

					.chat-bubble {
						transition: opacity 0.3s ease;
						transform: none !important;
					}

					.chat-bubble:hover {
						transform: none !important;
					}
				}

				/* Hide when mobile menu is open */
				@media only screen and (max-width: 991px) {
					body.mobile-menu-open .chatbot-button,
					body.mobile-menu-open .chat-bubble {
						opacity: 0;
						visibility: hidden;
						pointer-events: none;
					}
				}
			</style>
		`;

		// Add styles to head
		$('head').append(chatbotStyles);

		// Add chatbot HTML to body
		$('body').append(chatbotHTML);

		// Add event listeners
		setupGlobalChatbotEvents();
	}

	// Setup event listeners for global chatbot
	function setupGlobalChatbotEvents() {
		const $chatButton = $('#globalChatbotBtn');
		const $chatBubble = $('#globalChatBubble');

		// Redirect to contact page with chat parameter
		function redirectToChat(e) {
			e.preventDefault();
			window.location.href = 'contact.html?chat=open';
		}

		// Click events
		$chatButton.on('click', redirectToChat);
		$chatBubble.on('click', redirectToChat);

		// Keyboard accessibility
		$chatButton.on('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				redirectToChat(e);
			}
		});

		// Show/hide on scroll (similar to back-to-top)
		let isScrolling = false;
		const showThreshold = 300;

		function handleScroll() {
			if (!isScrolling) {
				window.requestAnimationFrame(function() {
					const scrollTop = $(window).scrollTop();
					
					if (scrollTop > showThreshold) {
						$chatButton.css('opacity', '1');
						$chatBubble.css('opacity', '1');
					} else {
						$chatButton.css('opacity', '0.8');
						$chatBubble.css('opacity', '0.8');
					}
					
					isScrolling = false;
				});
			}
			isScrolling = true;
		}

		// Setup scroll listener
		$(window).on('scroll', handleScroll);

		// Initial visibility
		setTimeout(function() {
			$chatButton.css('opacity', '1');
			$chatBubble.css('opacity', '1');
		}, 1000);
	}

	// Initialize global chatbot when DOM is ready
	$(document).ready(function() {
		initGlobalChatbot();
	});
	
})(jQuery);