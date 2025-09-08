/**
 * TDE Trading Contact Form Handler
 * 
 * Handles form validation and AJAX submission for the contact form
 */

$(document).ready(function() {
    
    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Get form elements
        const fnameInput = document.getElementById('fname');
        const lnameInput = document.getElementById('lname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');
        const formStartTimeInput = document.getElementById('form-start-time');
        const allInputs = [fnameInput, lnameInput, emailInput, phoneInput, messageInput];

        // Initialize form start time for bot delay protection
        if (formStartTimeInput) {
            formStartTimeInput.value = Date.now();
            
            // Disable submit button for 20 seconds
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Please wait 20 seconds...';
            
            let countdown = 20;
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    submitBtn.innerHTML = `Please wait ${countdown} seconds...`;
                } else {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="btn-text">send message</span><span class="btn-loading">sending...</span>';
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }

        // Show styled validation message
        function showError(input, message) {
            const errorBlock = input.parentElement.querySelector('.help-block.with-errors');
            if (errorBlock) {
                errorBlock.textContent = message;
                errorBlock.style.display = 'block';
                errorBlock.style.color = '#dc3545';
            }
            input.classList.add('is-invalid');
        }

        // Clear error message
        function clearError(input) {
            const errorBlock = input.parentElement.querySelector('.help-block.with-errors');
            if (errorBlock) {
                errorBlock.textContent = '';
                errorBlock.style.display = 'none';
            }
            input.classList.remove('is-invalid');
        }

        // Validate first name field
        function validateFirstName(input) {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'First name is required');
                return false;
            } else if (value.length < 2) {
                showError(input, 'First name must be at least 2 characters');
                return false;
            } else if (value.length > 30) {
                showError(input, 'First name must be no more than 30 characters');
                return false;
            } else if (!/^[A-Za-z\s\-\']+$/.test(value)) {
                showError(input, 'First name can only contain letters, spaces, hyphens, and apostrophes');
                return false;
            } else {
                clearError(input);
                return true;
            }
        }

        // Validate last name field
        function validateLastName(input) {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Last name is required');
                return false;
            } else if (value.length < 2) {
                showError(input, 'Last name must be at least 2 characters');
                return false;
            } else if (value.length > 30) {
                showError(input, 'Last name must be no more than 30 characters');
                return false;
            } else if (!/^[A-Za-z\s\-\']+$/.test(value)) {
                showError(input, 'Last name can only contain letters, spaces, hyphens, and apostrophes');
                return false;
            } else {
                clearError(input);
                return true;
            }
        }

        // Validate email field
        function validateEmail(input) {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Email is required');
                return false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            } else {
                clearError(input);
                return true;
            }
        }

        // Validate phone field
        function validatePhone(input) {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Phone number is required');
                return false;
            } else {
                // Remove all non-numeric characters for validation
                const numericPhone = value.replace(/[^0-9]/g, '');
                if (numericPhone.length < 8) {
                    showError(input, 'Phone number must be at least 8 digits');
                    return false;
                } else if (numericPhone.length > 15) {
                    showError(input, 'Phone number must be no more than 15 digits');
                    return false;
                } else {
                    clearError(input);
                    return true;
                }
            }
        }

        // Validate message field
        function validateMessage(input) {
            const value = input.value.trim();
            if (value === '') {
                showError(input, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showError(input, 'Message must be at least 10 characters');
                return false;
            } else if (value.length > 2000) {
                showError(input, 'Message must be no more than 2000 characters');
                return false;
            } else {
                clearError(input);
                return true;
            }
        }


        // Validate all form fields
        function validateForm() {
            const isFnameValid = validateFirstName(fnameInput);
            const isLnameValid = validateLastName(lnameInput);
            const isEmailValid = validateEmail(emailInput);
            const isPhoneValid = validatePhone(phoneInput);
            const isMessageValid = validateMessage(messageInput);

            return isFnameValid && isLnameValid && isEmailValid && isPhoneValid && isMessageValid;
        }

        // Add input event listeners for real-time validation
        fnameInput.addEventListener('input', function() {
            validateFirstName(this);
        });

        lnameInput.addEventListener('input', function() {
            validateLastName(this);
        });

        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });

        phoneInput.addEventListener('input', function() {
            validatePhone(this);
        });

        messageInput.addEventListener('input', function() {
            validateMessage(this);
        });

        // Add blur event listeners for validation when leaving a field
        allInputs.forEach(input => {
            input.addEventListener('blur', function() {
                // Call appropriate validation function based on input ID
                if (this.id === 'fname') {
                    validateFirstName(this);
                } else if (this.id === 'lname') {
                    validateLastName(this);
                } else if (this.id === 'email') {
                    validateEmail(this);
                } else if (this.id === 'phone') {
                    validatePhone(this);
                } else if (this.id === 'message') {
                    validateMessage(this);
                }
            });
        });

        // Form submission with enhanced validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Always prevent default form submission

            // First validate all fields
            const isValid = validateForm();

            if (!isValid) {
                // Focus the first input with an error
                const firstInvalidInput = document.querySelector('.is-invalid');
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                }
                return false;
            }

            // Show loading state
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            if (btnText && btnLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            } else {
                submitBtn.innerHTML = 'Sending...';
            }

            // Create FormData
            const formData = new FormData(contactForm);


            // Log the form data being sent (for debugging)
            console.log('Sending form data to:', contactForm.action);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // Use AJAX to submit the form
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                    // Don't set Content-Type when using FormData - it will be set automatically with boundary
                }
            })
            .then(response => {
                console.log('Server response status:', response.status);

                if (!response.ok) {
                    if (response.status === 405) {
                        throw new Error('Method Not Allowed (405): The server does not allow POST requests to this endpoint. Please check server configuration.');
                    }
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                // First try to get response as text
                return response.text().then(text => {
                    console.log('Server response text:', text);
                    try {
                        // Try to parse as JSON
                        const jsonData = JSON.parse(text);
                        console.log('Parsed JSON response:', jsonData);
                        return jsonData;
                    } catch (e) {
                        // If not valid JSON, return the text
                        console.error('Server returned non-JSON response:', text);
                        return {
                            success: false,
                            message: 'Server returned an invalid response format',
                            raw: text
                        };
                    }
                });
            })
            .then(data => {
                // Reset button state
                resetButtonState();

                // Handle the response
                handleFormSubmissionResponse(data);
            })
            .catch(error => {
                // Reset button state
                resetButtonState();

                // Show error message
                showFormError('Error: ' + error.message);
                console.error('Form submission error:', error);
            });
        });

        // Reset button state
        function resetButtonState() {
            submitBtn.disabled = false;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            if (btnText && btnLoading) {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            } else {
                submitBtn.innerHTML = 'send message';
            }
        }

        // Show form error message
        function showFormError(message) {
            // Try to use existing form response element
            let responseElement = document.getElementById('msgSubmit');
            if (!responseElement) {
                responseElement = document.querySelector('.form-response');
            }
            if (!responseElement) {
                // Create new response element if none exists
                responseElement = document.createElement('div');
                responseElement.className = 'form-response';
                responseElement.id = 'msgSubmit';
                submitBtn.parentElement.appendChild(responseElement);
            }
            
            // Clear previous classes and animations
            responseElement.className = 'form-response error show';
            responseElement.innerHTML = message;
            responseElement.style.display = 'block';
            
            // Hide message after 7 seconds with animation
            setTimeout(function() {
                responseElement.className = 'form-response error hide';
                setTimeout(function() {
                    responseElement.style.display = 'none';
                    responseElement.className = 'form-response';
                }, 300);
            }, 7000);
        }

        // Show form success message
        function showFormSuccess(message) {
            // Try to use existing form response element
            let responseElement = document.getElementById('msgSubmit');
            if (!responseElement) {
                responseElement = document.querySelector('.form-response');
            }
            if (!responseElement) {
                // Create new response element if none exists
                responseElement = document.createElement('div');
                responseElement.className = 'form-response';
                responseElement.id = 'msgSubmit';
                submitBtn.parentElement.appendChild(responseElement);
            }
            
            // Clear previous classes and animations
            responseElement.className = 'form-response success show';
            responseElement.innerHTML = message;
            responseElement.style.display = 'block';
            
            // Hide message after 10 seconds with animation
            setTimeout(function() {
                responseElement.className = 'form-response success hide';
                setTimeout(function() {
                    responseElement.style.display = 'none';
                    responseElement.className = 'form-response';
                }, 300);
            }, 10000);
        }

        // Handle form submission response
        function handleFormSubmissionResponse(response) {
            console.log('Handling form submission response:', response);
            if (response.success) {
                // Show success message
                showFormSuccess(response.message);

                // Reset form
                contactForm.reset();
                

                // Clear any existing validation errors
                allInputs.forEach(input => {
                    clearError(input);
                });

            } else {
                // Show error message
                if (response.errors && Array.isArray(response.errors)) {
                    // Display field-specific errors
                    response.errors.forEach(error => {
                        // Attempt to determine which field the error is for
                        if (error.toLowerCase().includes('first name')) {
                            showError(fnameInput, error);
                        } else if (error.toLowerCase().includes('last name')) {
                            showError(lnameInput, error);
                        } else if (error.toLowerCase().includes('email')) {
                            showError(emailInput, error);
                        } else if (error.toLowerCase().includes('phone')) {
                            showError(phoneInput, error);
                        } else if (error.toLowerCase().includes('message')) {
                            showError(messageInput, error);
                        } else {
                            // Generic error - show in form response
                            showFormError(error);
                        }
                    });
                } else {
                    // Display general error message
                    showFormError(response.message || 'An error occurred. Please try again.');
                }
            }
        }
    }
}); 