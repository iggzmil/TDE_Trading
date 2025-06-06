/**
 * TDE Trading Contact Form Handler
 * Enhanced JavaScript for contact form submission with validation and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const msgSubmit = document.getElementById('msgSubmit');
    
    // Initialize button state - show text, hide loading
    if (btnText && btnLoading) {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }

    // Form validation patterns
    const validationPatterns = {
        name: /^[A-Za-z\s\-'\\.]+$/u,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[\d\s\-\(\)]+$/
    };

    // Real-time validation for individual fields
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        clearFieldError(field);

        if (!value && field.required) {
            errorMessage = `${getFieldLabel(fieldName)} is required`;
            isValid = false;
        } else if (value) {
            switch (fieldName) {
                case 'fname':
                case 'lname':
                    if (value.length < 2) {
                        errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters`;
                        isValid = false;
                    } else if (value.length > 30) {
                        errorMessage = `${getFieldLabel(fieldName)} must be no more than 30 characters`;
                        isValid = false;
                    } else if (!validationPatterns.name.test(value)) {
                        errorMessage = `${getFieldLabel(fieldName)} can only contain letters, spaces, hyphens, and apostrophes`;
                        isValid = false;
                    }
                    break;

                case 'email':
                    if (value.length > 254) {
                        errorMessage = 'Email address is too long';
                        isValid = false;
                    } else if (!validationPatterns.email.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    } else {
                        // Check for common typos
                        const commonTypos = {
                            'gmial.com': 'gmail.com',
                            'gmai.com': 'gmail.com',
                            'yahooo.com': 'yahoo.com',
                            'hotmial.com': 'hotmail.com'
                        };
                        
                        const domain = value.split('@')[1];
                        if (domain && commonTypos[domain]) {
                            showFieldSuggestion(field, `Did you mean ${value.replace(domain, commonTypos[domain])}?`);
                        }
                    }
                    break;

                case 'phone':
                    const phoneClean = value.replace(/[\s\-\(\)\+]/g, '');
                    if (phoneClean.length < 8) {
                        errorMessage = 'Phone number is too short';
                        isValid = false;
                    } else if (phoneClean.length > 15) {
                        errorMessage = 'Phone number is too long';
                        isValid = false;
                    } else if (!validationPatterns.phone.test(value)) {
                        errorMessage = 'Phone number contains invalid characters';
                        isValid = false;
                    } else if (!/\d/.test(phoneClean)) {
                        errorMessage = 'Phone number must contain digits';
                        isValid = false;
                    }
                    break;

                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters';
                        isValid = false;
                    } else if (value.length > 2000) {
                        errorMessage = 'Message must be no more than 2000 characters';
                        isValid = false;
                    }
                    break;
            }
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Get user-friendly field labels
    function getFieldLabel(fieldName) {
        const labels = {
            'fname': 'First name',
            'lname': 'Last name',
            'email': 'Email address',
            'phone': 'Phone number',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    // Show field-specific error
    function showFieldError(field, message) {
        const helpBlock = field.parentNode.querySelector('.help-block');
        if (helpBlock) {
            helpBlock.innerHTML = `<ul class="list-unstyled"><li>${message}</li></ul>`;
            helpBlock.style.display = 'block';
        }
        field.classList.add('error');
    }

    // Show field suggestion
    function showFieldSuggestion(field, message) {
        const helpBlock = field.parentNode.querySelector('.help-block');
        if (helpBlock) {
            helpBlock.innerHTML = `<ul class="list-unstyled suggestion"><li>${message}</li></ul>`;
            helpBlock.style.display = 'block';
        }
    }

    // Clear field error
    function clearFieldError(field) {
        const helpBlock = field.parentNode.querySelector('.help-block');
        if (helpBlock) {
            helpBlock.innerHTML = '';
            helpBlock.style.display = 'none';
        }
        field.classList.remove('error');
    }

    // Add real-time validation to form fields
    ['fname', 'lname', 'email', 'phone', 'message'].forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Validate on blur (when user leaves the field)
            field.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear errors on focus
            field.addEventListener('focus', function() {
                clearFieldError(this);
            });

            // For email field, also validate on input for typo suggestions
            if (fieldName === 'email') {
                let emailTimeout;
                field.addEventListener('input', function() {
                    clearTimeout(emailTimeout);
                    emailTimeout = setTimeout(() => {
                        if (this.value.includes('@')) {
                            validateField(this);
                        }
                    }, 500);
                });
            }
        }
    });

    // Show loading state
    function showLoading() {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.classList.add('loading');
    }

    // Hide loading state
    function hideLoading() {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.classList.remove('loading');
    }

    // Show form response message
    function showMessage(message, isSuccess = false, errors = []) {
        msgSubmit.innerHTML = '';
        
        if (isSuccess) {
            msgSubmit.innerHTML = `<div class="alert alert-success"><i class="fa fa-check-circle"></i> ${message}</div>`;
            msgSubmit.className = 'form-response success';
        } else {
            let errorHtml = `<div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> ${message}`;
            
            if (errors && errors.length > 0) {
                errorHtml += '<ul class="error-list">';
                errors.forEach(error => {
                    errorHtml += `<li>${error}</li>`;
                });
                errorHtml += '</ul>';
            }
            
            errorHtml += '</div>';
            msgSubmit.innerHTML = errorHtml;
            msgSubmit.className = 'form-response error';
        }

        // Scroll to message
        msgSubmit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 5 seconds
        if (isSuccess) {
            setTimeout(() => {
                msgSubmit.innerHTML = '';
                msgSubmit.className = 'form-response';
            }, 5000);
        }
    }

    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous messages
        msgSubmit.innerHTML = '';

        // Validate all fields
        let isFormValid = true;
        const formData = new FormData(this);
        
        // Validate each field
        ['fname', 'lname', 'email', 'phone', 'message'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField(field)) {
                isFormValid = false;
            }
        });

        // Validate reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            showMessage('Please complete the reCAPTCHA verification.');
            return;
        }

        // Add reCAPTCHA response to form data
        formData.append('g-recaptcha-response', recaptchaResponse);

        if (!isFormValid) {
            showMessage('Please correct the errors above before submitting.');
            return;
        }

        // Show loading state
        showLoading();

        // Submit form via AJAX
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();

            if (data.success) {
                showMessage(data.message, true);
                // Reset form on success
                this.reset();
                // Reset reCAPTCHA
                grecaptcha.reset();
                // Clear any remaining field errors
                ['fname', 'lname', 'email', 'phone', 'message'].forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                        clearFieldError(field);
                    }
                });
            } else {
                showMessage(data.message, false, data.errors);
                // Reset reCAPTCHA on error to allow retry
                grecaptcha.reset();
                
                // If rate limited, show retry time
                if (data.retry_after) {
                    setTimeout(() => {
                        msgSubmit.innerHTML = '';
                        msgSubmit.className = 'form-response';
                    }, data.retry_after * 1000);
                }
            }
        })
        .catch(error => {
            hideLoading();
            // Reset reCAPTCHA on error
            grecaptcha.reset();
            console.error('Form submission error:', error);
            showMessage('We apologise, but there was a technical problem submitting your message. Please try again later or contact us directly.');
        });
    });

    // Add character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = parseInt(messageField.getAttribute('maxlength')) || 2000;
        
        // Create character counter element
        const counterElement = document.createElement('div');
        counterElement.className = 'character-counter';
        counterElement.style.cssText = 'font-size: 12px; color: #8F8F8F; text-align: right; margin-top: 5px;';
        messageField.parentNode.appendChild(counterElement);

        // Update character counter
        function updateCounter() {
            const currentLength = messageField.value.length;
            const remaining = maxLength - currentLength;
            counterElement.textContent = `${currentLength}/${maxLength} characters`;
            
            if (remaining < 100) {
                counterElement.style.color = '#e74c3c';
            } else if (remaining < 200) {
                counterElement.style.color = '#f39c12';
            } else {
                counterElement.style.color = '#8F8F8F';
            }
        }

        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }
});

// Add CSS for form enhancements
const style = document.createElement('style');
style.textContent = `
.form-control.error {
    border-color: #e74c3c !important;
    box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25) !important;
}

.help-block ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.help-block li {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
}

.help-block.suggestion li {
    color: #f39c12;
    font-style: italic;
}

.form-response {
    margin-top: 20px;
}

.form-response .alert {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 0;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
}

.error-list {
    margin: 10px 0 0 0;
    padding-left: 20px;
}

.error-list li {
    margin-bottom: 5px;
}

.btn-default.loading {
    opacity: 0.7;
    cursor: not-allowed;
}

.character-counter {
    transition: color 0.3s ease;
}

.form-submit-container {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
}

.submit-btn-wrapper {
    flex: 1;
    min-width: 200px;
}

.recaptcha-wrapper {
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .form-submit-container {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }
    
    .recaptcha-wrapper {
        align-self: center;
    }
}

@media (max-width: 480px) {
    .recaptcha-wrapper .g-recaptcha {
        transform: scale(0.85);
        transform-origin: 0 0;
    }
}
`;
document.head.appendChild(style); 