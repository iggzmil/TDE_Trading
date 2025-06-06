/**
 * TDE Trading Chat Widget with N8N Integration
 * Adapted from AAA City Chat Widget for TDE Trading
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we need to auto-open the chat
  const urlParams = new URLSearchParams(window.location.search);
  const shouldOpenChat = urlParams.get('openChat') === 'true';

  // Create chat container if it doesn't exist
  let chatContainer = document.getElementById('tde-chat-container');
  if (!chatContainer) {
    chatContainer = document.createElement('div');
    chatContainer.id = 'tde-chat-container';
    document.body.appendChild(chatContainer);
  }

  // Create a shadow root for style isolation
  const shadowRoot = chatContainer.attachShadow({ mode: 'open' });

  // Add chat widget styles to the shadow DOM
  const chatStyles = document.createElement('style');
  chatStyles.textContent = `
    /* ===================================
       CHATBOT BUTTON & BUBBLE STYLING
       ===================================*/
    
                    /* Import TDE flaticon font for shadow DOM */
                @font-face {
                    font-family: 'flaticon_tde_trading';
                    src: url('/webfonts/flaticon_tde_trading.woff2?630161088d72ffee2a1570c90308f34d') format('woff2'),
                         url('/webfonts/flaticon_tde_trading.woff?630161088d72ffee2a1570c90308f34d') format('woff'),
                         url('/webfonts/flaticon_tde_trading.eot?630161088d72ffee2a1570c90308f34d#iefix') format('embedded-opentype'),
                         url('/webfonts/flaticon_tde_trading.ttf?630161088d72ffee2a1570c90308f34d') format('truetype'),
                         url('/webfonts/flaticon_tde_trading.svg?630161088d72ffee2a1570c90308f34d#flaticon_tde_trading') format('svg');
                    font-weight: normal;
                    font-style: normal;
                }

                /* Flaticon icon classes for shadow DOM */
                i[class^="flaticon-"]:before, i[class*=" flaticon-"]:before {
                    font-family: flaticon_tde_trading !important;
                    font-style: normal;
                    font-weight: normal !important;
                    font-variant: normal;
                    text-transform: none;
                    line-height: 1;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .flaticon-top-right-1:before {
                    content: "\\f12d";
                }

    /* CSS variables matching the main site */
    :host {
      --dark-color: #042a2d;
      --accent-color: #28a745;
      --white-color: #ffffff;
    }

    /* Base container */
    .tde-chat-container {
      position: fixed;
      bottom: 30px;
      right: 20px;
      left: auto;
      z-index: 9999;
      font-family: 'Fustat', sans-serif;
      transition: all 0.3s ease;
    }

    /* Chat Bubble - EXACT copy of global chatbot styling */
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

    /* Mobile adjustments */
    @media (max-width: 767px) {
      .tde-chat-container {
        bottom: 80px !important;
        right: 15px !important;
      }

      /* Hide chat bubble on mobile devices - higher specificity */
      .chat-bubble,
      .chat-bubble.show {
        display: none !important;
      }
    }

    /* Additional landscape-specific rule for chat bubble - more specific */
    @media (max-width: 767px) and (orientation: landscape) {
      .chat-bubble,
      .chat-bubble.show {
        display: none !important;
      }
    }

    /* Additional portrait-specific rule for chat bubble - more specific */
    @media (max-width: 767px) and (orientation: portrait) {
      .chat-bubble,
      .chat-bubble.show {
        display: none !important;
      }
    }

    /* Mobile landscape specific adjustments for better positioning */
    @media (max-width: 767px) and (orientation: landscape) {
      .tde-chat-container {
        bottom: 75px !important;
        right: 10px !important;
      }
    }

    /* Hide bubble when chat is expanded */
    .tde-chat-container:not(.minimized) .chat-bubble {
      display: none;
    }

    /* Display bubble with delay after page load */
    .chat-bubble.show {
      display: block;
    }

    /* Minimized state */
    .tde-chat-container.minimized {
      width: auto;
      height: auto;
      cursor: pointer;
    }

    .tde-chat-container.minimized .tde-chat-expanded {
      display: none;
    }

    .tde-chat-container.minimized .chatbot-button {
      display: flex;
    }

    /* Expanded state */
    .tde-chat-container:not(.minimized) {
      width: 320px;
      height: 480px;
      background: #000;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .tde-chat-container:not(.minimized) .chatbot-button {
      display: none;
    }
    
    .tde-chat-container:not(.minimized) .chat-bubble {
      display: none;
    }

    .tde-chat-container:not(.minimized) .tde-chat-expanded {
      display: flex;
    }



    /* Expanded view */
    .tde-chat-expanded {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* Header */
    .tde-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      background: linear-gradient(135deg, #019297 0%, #73ED7C 100%);
      color: #ffffff;
      border-bottom: 1px solid #019297;
    }

    .tde-chat-header h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.2;
      color: #ffffff;
      font-family: 'Fustat', sans-serif;
    }

    .tde-chat-header .powered-by {
      font-size: 11px;
      opacity: 0.8;
      font-weight: 400;
      margin-top: 2px;
      display: block;
    }

    .tde-chat-close-btn {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s ease;
    }

    .tde-chat-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Messages area */
    .tde-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tde-chat-message {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    }

    .tde-chat-message.user {
      align-items: flex-end;
    }

    .tde-chat-message.bot {
      align-items: flex-start;
    }

    .tde-chat-message-content {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .tde-chat-message.user .tde-chat-message-content {
      background: #28a745;
      color: white;
    }

    .tde-chat-message.bot .tde-chat-message-content {
      background: #f1f3f4;
      color: #333;
    }

    /* Input area */
    .tde-chat-input-area {
      padding: 15px;
      background: white;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 10px;
    }

    .tde-chat-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      font-family: 'Fustat', sans-serif;
    }

    .tde-chat-input:focus {
      border-color: #73ED7C;
    }

    .tde-chat-send {
      background: #73ED7C;
      color: #ffffff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(115, 237, 124, 0.3);
    }

    .tde-chat-send i {
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .tde-chat-send:hover {
      background: #019297;
      color: #ffffff;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(1, 146, 151, 0.4);
    }

    .tde-chat-send:hover i {
      transform: translateX(2px);
    }

    .tde-chat-send:disabled {
      background: #6c757d;
      color: #ffffff;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Loading indicator */
    .tde-chat-loading {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .tde-chat-loading-dot {
      width: 6px;
      height: 6px;
      background: #6c757d;
      border-radius: 50%;
      animation: loading-bounce 1.4s ease-in-out infinite both;
    }

    .tde-chat-loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .tde-chat-loading-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes loading-bounce {
      0%, 80%, 100% {
        transform: scale(0);
      } 40% {
        transform: scale(1);
      }
    }

    /* TDE Chat Container Styling - Contact Page Specific */
    .tde-chat-container {
      position: fixed;
      bottom: 30px;
      right: 20px;
      left: auto;
      z-index: 9999;
      font-family: 'Fustat', sans-serif;
      transition: all 0.3s ease;
    }

    /* Chatbot Button - EXACT copy of global chatbot styling */
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

    /* Responsive positioning - EXACT copy of global chatbot */
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

    /* Hide when mobile menu is open - like global chatbot */
    @media only screen and (max-width: 991px) {
      body.mobile-menu-open .chatbot-button,
      body.mobile-menu-open .chat-bubble {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
    }

    /* Chat Interface Styling */
    .chat-interface {
      position: fixed;
      right: 20px;
      bottom: 80px;
      width: 350px;
      height: 500px;
      background: var(--white-color);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(4, 42, 45, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
      border: 1px solid rgba(4, 42, 45, 0.1);
    }


  `;

  shadowRoot.appendChild(chatStyles);

  // Generate a session ID for this chat session
  const sessionId = 'tde_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  let isFirstMessage = true;
  let isProcessing = false;
  let loadingIndicator = null;

  // Create the chat widget HTML
  const chatHTML = `
    <div class="tde-chat-container minimized">
      <!-- Chat bubble that appears - EXACTLY like global chatbot -->
      <div class="chat-bubble">
        Questions about trading? Let's chat!
      </div>
      
      <!-- Minimized view - EXACTLY like global chatbot -->
      <div class="chatbot-button">
      </div>
      
      <!-- Expanded view -->
      <div class="tde-chat-expanded">
        <div class="tde-chat-header">
          <h3>TDE Trading AI Assistant<br><span class="powered-by">powered by AAA.City</span></h3>
          <button class="tde-chat-close-btn">×</button>
        </div>
        
        <div class="tde-chat-messages">
          <div class="tde-chat-message bot">
            <div class="tde-chat-message-content">
              Hi! I'm here to help with your trading questions. How can I assist you today?
            </div>
          </div>
        </div>
        
        <div class="tde-chat-input-area">
          <input type="text" class="tde-chat-input" placeholder="Type your message..." />
          <button class="tde-chat-send">
            <i class="flaticon-top-right-1" style="font-size: 26px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  shadowRoot.innerHTML = chatHTML + shadowRoot.innerHTML;

  // Get references to elements
  const chatWidget = shadowRoot.querySelector('.tde-chat-container');
  const minimizedView = shadowRoot.querySelector('.chatbot-button');
  const expandedView = shadowRoot.querySelector('.tde-chat-expanded');
  const messagesContainer = shadowRoot.querySelector('.tde-chat-messages');
  const chatBubble = shadowRoot.querySelector('.chat-bubble');

  // Function to show chat bubble - Always visible when minimized
  function showChatBubble() {
    if (chatBubble && chatWidget.classList.contains('minimized')) {
      chatBubble.style.display = 'block';
      // Bubble is always visible - no auto-hide functionality
    }
  }

  // Show chat bubble immediately
  showChatBubble();

  // Toggle chat widget
  function toggle() {
    console.log('Chat widget toggled');
    chatWidget.classList.toggle('minimized');
    
    // Hide bubble when opened
    if (!chatWidget.classList.contains('minimized') && chatBubble) {
      chatBubble.style.display = 'none';
    }
    
    // Focus input when expanded
    if (!chatWidget.classList.contains('minimized')) {
      const inputElem = expandedView.querySelector('.tde-chat-input');
      setTimeout(() => inputElem.focus(), 100);
    } else {
      // When minimized (closed), show bubble immediately
      showChatBubble();
    }
  }

  // Add message to chat
  function addMessage(text, sender) {
    // If this is a bot message, ensure loading indicators are removed first
    if (sender === 'bot') {
      removeAllLoadingIndicators();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `tde-chat-message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'tde-chat-message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Create loading indicator
  function createLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'tde-chat-message bot';
    loadingDiv.innerHTML = `
      <div class="tde-chat-message-content">
        <div class="tde-chat-loading">
          <div class="tde-chat-loading-dot"></div>
          <div class="tde-chat-loading-dot"></div>
          <div class="tde-chat-loading-dot"></div>
        </div>
      </div>
    `;
    return loadingDiv;
  }

  // Remove all loading indicators from chat
  function removeAllLoadingIndicators() {
    // Find and remove all loading indicators
    const loadingElements = messagesContainer.querySelectorAll('.tde-chat-loading');
    loadingElements.forEach(loadingEl => {
      const messageEl = loadingEl.closest('.tde-chat-message');
      if (messageEl && messageEl.parentNode === messagesContainer) {
        messagesContainer.removeChild(messageEl);
      }
    });
    loadingIndicator = null;
  }

  // Set processing state
  function setProcessingState(processing) {
    console.log('Setting processing state:', processing);
    isProcessing = processing;
    const sendBtn = expandedView.querySelector('.tde-chat-send');
    const inputElem = expandedView.querySelector('.tde-chat-input');
    
    if (processing) {
      sendBtn.disabled = true;
      inputElem.disabled = true;
      
      // Always remove any existing loading indicators first
      removeAllLoadingIndicators();
      
      // Add new loading indicator
      loadingIndicator = createLoadingIndicator();
      messagesContainer.appendChild(loadingIndicator);
      console.log('Loading indicator added');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
      sendBtn.disabled = false;
      inputElem.disabled = false;
      
      // Remove all loading indicators
      removeAllLoadingIndicators();
      console.log('All loading indicators removed');

      // Re-focus the input field
      setTimeout(() => {
        const inputElem = expandedView.querySelector('.tde-chat-input');
        if (inputElem) {
          inputElem.focus();
        }
      }, 100);
    }
  }

  // Get fallback response when webhook fails
  function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for specific keywords
    if (lowerMessage.includes('help')) {
      return "I'd be happy to help! You can ask me about our trading courses, mentorship programs, or how we can help you improve your trading results. If you need immediate assistance, please call us at (+61) 430 333 813 or email info@tdetrading.com.au.";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "Our pricing varies depending on the specific course and mentorship program. For detailed pricing information, please visit our pricing page or contact us directly for a personalized quote.";
    }

    if (lowerMessage.includes('course') || lowerMessage.includes('education') || lowerMessage.includes('learn')) {
      return "We offer comprehensive trading education covering Forex, Crypto, Commodities, and Indices. Our courses include live mentorship and ongoing community support. Would you like more information about a specific trading area?";
    }

    if (lowerMessage.includes('trading') || lowerMessage.includes('forex') || lowerMessage.includes('crypto')) {
      return "We specialize in professional trading education for Forex, Cryptocurrency, Commodities, and Indices. Our programs combine education with mentorship to help you develop profitable trading strategies.";
    }

    // Default fallback response
    return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly at (+61) 430 333 813 or info@tdetrading.com.au.";
  }

  // Process user message
  async function processUserMessage(message) {
    try {
      setProcessingState(true);

      // Set a timeout to handle cases where the webhook doesn't respond
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout: The chat service did not respond in time.')), 15000);
      });

      // Build the payload
      const payload = {
        sessionId: sessionId,
        chatInput: message,
        isNewSession: isFirstMessage
      };

      console.log('Sending payload to N8N:', payload);

      // After sending, mark this as no longer the first message
      if (isFirstMessage) {
        console.log('First message in session - isNewSession=true');
        isFirstMessage = false;
      }

      // Send to webhook
      let response;
      let data;

      try {
        // Use the TDE Trading webhook URL
        response = await Promise.race([
          fetch('https://n8n.aaa-city.com/webhook/15dc7a69-83a6-42fc-9e76-02bab31514f3/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }),
          timeoutPromise
        ]);

        if (!response.ok) {
          let errorMessage = '';
          try {
            const errorText = await response.text();
            errorMessage = JSON.parse(errorText).message;
          } catch (e) {
            errorMessage = `Server error: ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        data = await response.json();
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error('Failed to connect to chat service. Please try again later.');
      }

      // Log the response for debugging
      console.log('Response from N8N:', data);

      // Handle N8N Chat Trigger response format
      if (data && data.output) {
        addMessage(data.output, 'bot');
      } else if (data && data.message) {
        addMessage(data.message, 'bot');
      } else if (data && data.response) {
        addMessage(data.response, 'bot');
      } else if (data && data.error) {
        console.error("Error from N8N:", data.error);
        addMessage("Sorry, I encountered an error. Please try again.", 'bot');
      } else {
        // If we get here, we either have an empty response or an unexpected format
        console.warn("Unexpected or empty response format from N8N:", data);

        // Use the fallback response generator
        const fallbackResponse = getFallbackResponse(message);
        addMessage(fallbackResponse, 'bot');
      }
    } catch (error) {
      console.error('Chat widget error:', error);

      // For N8N specific errors, provide more helpful messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('N8N webhook connection error - the server might be down or unreachable');
        addMessage("I'm having trouble connecting to my knowledge base. This might be a temporary issue. Please try again in a few moments or contact us directly at (+61) 430 333 813.", 'bot');
        return;
      }

      // Handle timeout errors gracefully
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        console.error('N8N webhook timeout error - the server is taking too long to respond');
        addMessage("I'm sorry, the chat service is taking too long to respond. Please try again later or contact us directly at (+61) 430 333 813.", 'bot');
        return;
      }

      // Use fallback responses for other errors
      const fallbackResponse = getFallbackResponse(message);
      addMessage(fallbackResponse, 'bot');
    } finally {
      setProcessingState(false);
    }
  }

  // Send message function
  function sendMessage() {
    const inputElem = expandedView.querySelector('.tde-chat-input');
    const message = inputElem.value.trim();

    if (message && !isProcessing) {
      // Add user message to chat
      addMessage(message, 'user');

      // Clear input
      inputElem.value = '';

      // Process the message
      processUserMessage(message);

      // Return focus to input field with slight delay to ensure it works
      setTimeout(() => {
        inputElem.focus();
      }, 50);
    }
  }

  // Add event listeners
  // Minimized view click
  minimizedView.addEventListener('click', function(e) {
    console.log('Chatbot button clicked');
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  // Chat bubble click
  chatBubble.addEventListener('click', function(e) {
    console.log('Chat bubble clicked');
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  // Close button click
  const closeBtn = expandedView.querySelector('.tde-chat-close-btn');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  // Send button click
  const sendBtn = expandedView.querySelector('.tde-chat-send');
  sendBtn.addEventListener('click', sendMessage);

  // Input Enter key and prevent spacebar interference
  const inputElem = expandedView.querySelector('.tde-chat-input');
  inputElem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Prevent smooth scroll from interfering with spacebar in chat input
  inputElem.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.keyCode === 32) {
      e.stopPropagation(); // Prevent smooth scroll from handling spacebar
    }
  });

  // Ensure input maintains focus and cursor position
  inputElem.addEventListener('focus', () => {
    // Move cursor to end of input when focused
    const len = inputElem.value.length;
    inputElem.setSelectionRange(len, len);
  });

  // Auto-expand chat if URL parameter is set
  if (shouldOpenChat) {
    toggle();
  }

  // Expose to global scope
  window.tdeTradingChat = {
    toggle,
    addMessage,
    processUserMessage
  };
}); 