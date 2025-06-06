<?php
/**
 * Contact Form Handler for TDE Trading
 *
 * This script processes contact form submissions from the TDE Trading website
 * and sends emails with enhanced validation and security features.
 */

// Include the TDE mail sender
require_once __DIR__ . '/tde-mail-sender.php';
require_once __DIR__ . '/session-handler.php';

// Disable error display to prevent HTML output interfering with JSON
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

// reCAPTCHA configuration
define('RECAPTCHA_SECRET_KEY', 'YOUR_SECRET_KEY_HERE'); // Replace with your actual secret key

// Function to verify reCAPTCHA
function verifyRecaptcha($recaptchaResponse) {
    if (empty($recaptchaResponse)) {
        return false;
    }

    $secretKey = RECAPTCHA_SECRET_KEY;
    
    // If secret key is not configured, skip validation (for development)
    if ($secretKey === 'YOUR_SECRET_KEY_HERE') {
        error_log('reCAPTCHA secret key not configured - skipping validation');
        return true; // Allow form submission in development
    }

    $verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
    $postData = http_build_query([
        'secret' => $secretKey,
        'response' => $recaptchaResponse,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $postData,
            'timeout' => 10
        ]
    ]);

    $response = file_get_contents($verifyURL, false, $context);
    
    if ($response === false) {
        error_log('Failed to verify reCAPTCHA - network error');
        return false;
    }

    $responseData = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('Failed to parse reCAPTCHA response JSON');
        return false;
    }

    return isset($responseData['success']) && $responseData['success'] === true;
}

// Set content type for responses
header('Content-Type: application/json');

// Allow CORS - use specific domain in production
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // 24 hours

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Rate limiting using session
function checkRateLimit() {
    if (!isset($_SESSION['last_submission'])) {
        $_SESSION['last_submission'] = time();
        $_SESSION['submission_count'] = 1;
        return true;
    }

    $timeSinceLastSubmission = time() - $_SESSION['last_submission'];
    
    // Allow one submission per minute
    if ($timeSinceLastSubmission < 60) {
        return false;
    }

    // Reset if more than an hour has passed
    if ($timeSinceLastSubmission > 3600) {
        $_SESSION['submission_count'] = 1;
    } else {
        $_SESSION['submission_count']++;
    }

    // Allow max 5 submissions per hour
    if ($_SESSION['submission_count'] > 5) {
        return false;
    }

    $_SESSION['last_submission'] = time();
    return true;
}

// Enhanced validation function
function validateContactForm($data) {
    $errors = [];

    // Required fields for TDE Trading contact form
    $requiredFields = ['fname', 'lname', 'email', 'phone', 'message'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        }
    }

    // First Name validation
    if (isset($data['fname']) && !empty($data['fname'])) {
        $fname = trim($data['fname']);

        // Check length
        if (strlen($fname) < 2) {
            $errors[] = 'First name must be at least 2 characters';
        } elseif (strlen($fname) > 30) {
            $errors[] = 'First name must be no more than 30 characters';
        }

        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        if (!preg_match('/^[A-Za-z\s\-\'\.]+$/u', $fname)) {
            $errors[] = 'First name can only contain letters, spaces, hyphens, and apostrophes';
        }
    }

    // Last Name validation
    if (isset($data['lname']) && !empty($data['lname'])) {
        $lname = trim($data['lname']);

        // Check length
        if (strlen($lname) < 2) {
            $errors[] = 'Last name must be at least 2 characters';
        } elseif (strlen($lname) > 30) {
            $errors[] = 'Last name must be no more than 30 characters';
        }

        // Check for valid characters
        if (!preg_match('/^[A-Za-z\s\-\'\.]+$/u', $lname)) {
            $errors[] = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        }
    }

    // Email validation
    if (isset($data['email']) && !empty($data['email'])) {
        $email = trim($data['email']);

        // Check length
        if (strlen($email) > 254) {
            $errors[] = 'Email address is too long';
        }

        // Basic email validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }

        // Check for potentially dangerous patterns
        $suspiciousPatterns = [
            'javascript:', 'data:', 'vbscript:', 'onload=', 'onerror=',
            '<script', '</script>', 'eval(', 'document.cookie'
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (stripos($email, $pattern) !== false) {
                $errors[] = 'Email contains invalid characters';
                break;
            }
        }

        // Domain validation (if email format is valid)
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $parts = explode('@', $email);
            if (count($parts) === 2) {
                $domain = $parts[1];
                
                // Check for common typos in popular domains
                $commonDomains = [
                    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
                    'aol.com', 'icloud.com', 'live.com', 'msn.com'
                ];
                
                $suspiciousDomains = [
                    'gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com'
                ];
                
                if (in_array($domain, $suspiciousDomains)) {
                    $errors[] = 'Please check your email address for typos';
                }

                // Basic DNS check (if domain doesn't look suspicious)
                if (!in_array($domain, $suspiciousDomains) && 
                    !checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
                    $errors[] = 'Email domain appears to be invalid';
                }
            }
        }
    }

    // Phone validation
    if (isset($data['phone']) && !empty($data['phone'])) {
        $phone = trim($data['phone']);

        // Remove common formatting characters for validation
        $phoneClean = preg_replace('/[\s\-\(\)\+]/', '', $phone);

        // Check length (allowing for international numbers)
        if (strlen($phoneClean) < 8) {
            $errors[] = 'Phone number is too short';
        } elseif (strlen($phoneClean) > 15) {
            $errors[] = 'Phone number is too long';
        }

        // Check for valid characters (numbers, spaces, dashes, parentheses, plus)
        if (!preg_match('/^[\+]?[\d\s\-\(\)]+$/', $phone)) {
            $errors[] = 'Phone number contains invalid characters';
        }

        // Check that it contains some digits
        if (!preg_match('/\d/', $phoneClean)) {
            $errors[] = 'Phone number must contain digits';
        }
    }

    // Message validation
    if (isset($data['message']) && !empty($data['message'])) {
        $message = trim($data['message']);

        // Check length
        if (strlen($message) < 10) {
            $errors[] = 'Message must be at least 10 characters';
        } elseif (strlen($message) > 2000) {
            $errors[] = 'Message must be no more than 2000 characters';
        }

        // Check for spam patterns
        $spamPatterns = [
            '/\b(viagra|cialis|lottery|winner|million dollars)\b/i',
            '/\b(click here|act now|limited time|urgent)\b/i',
            '/(http:\/\/|https:\/\/|www\.)[^\s]{10,}/i', // Long URLs
            '/(.)\1{10,}/', // Repeated characters
            '/[A-Z]{10,}/', // All caps words
        ];

        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $message)) {
                $errors[] = 'Message appears to contain spam content';
                break;
            }
        }

        // Check for suspicious HTML or script content
        $suspiciousContent = [
            '<script', '</script>', 'javascript:', 'onload=', 'onerror=',
            'document.cookie', 'eval(', 'iframe', 'embed'
        ];

        foreach ($suspiciousContent as $content) {
            if (stripos($message, $content) !== false) {
                $errors[] = 'Message contains prohibited content';
                break;
            }
        }
    }

    return $errors;
}

// Get the request data based on content type
$requestData = [];

// Log information about the request for debugging
$debugInfo = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
    'has_post' => !empty($_POST),
    'has_raw_input' => !empty(file_get_contents('php://input')),
    'timestamp' => date('Y-m-d H:i:s'),
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Handle GET request (for testing only)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'This endpoint accepts POST requests only',
        'csrf_token' => getCsrfToken(),
        'debug' => $debugInfo
    ]);
    exit;
}

// Process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
    // Check rate limiting
    if (!checkRateLimit()) {
        echo json_encode([
            'success' => false,
            'message' => 'Too many submissions. Please wait before trying again.',
            'retry_after' => 60
        ]);
        exit;
    }

    // Check if this is a JSON request
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $jsonData = json_decode(file_get_contents('php://input'), true);
        if ($jsonData) {
            $requestData = $jsonData;
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid JSON data',
                'debug' => $debugInfo
            ]);
            exit;
        }
    } else {
        // Regular form POST data
        $requestData = $_POST;
    }

    // Check if we have any data
    if (empty($requestData)) {
        echo json_encode([
            'success' => false,
            'message' => 'No form data received'
        ]);
        exit;
    }

    // Sanitize input data
    $sanitizedData = [];
    foreach ($requestData as $key => $value) {
        if (is_string($value)) {
            // Remove potential XSS vectors while preserving legitimate content
            $sanitizedData[$key] = trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
        } else {
            $sanitizedData[$key] = $value;
        }
    }

    // Validate reCAPTCHA first
    $recaptchaResponse = $sanitizedData['g-recaptcha-response'] ?? '';
    if (!verifyRecaptcha($recaptchaResponse)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please complete the reCAPTCHA verification.',
            'errors' => ['reCAPTCHA verification failed']
        ]);
        exit;
    }

    // Validate form data
    $errors = validateContactForm($sanitizedData);

    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please correct the following issues:',
            'errors' => $errors
        ]);
        exit;
    }

    // Create HTML email content
    $emailHtml = createTDEContactEmailHtml($sanitizedData);

    // Set the recipient email for TDE Trading
    $recipientEmail = 'info@tdetrading.com.au';
    
    // Set the subject format
    $emailSubject = 'TDE Trading - Website Contact Form Submission';

    // Set the reply-to as the user's email
    $replyTo = $sanitizedData['email'];

    // Send the email
    $emailResult = sendTDEEmail(
        $recipientEmail,
        $emailSubject,
        $emailHtml,
        'TDE Trading Website',
        $replyTo
    );

    if ($emailResult['success']) {
        // Log successful submission (optional)
        error_log("Contact form submission from: " . $sanitizedData['email'] . " at " . date('Y-m-d H:i:s'));

        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you within 24 hours.'
        ]);
    } else {
        // Log the error
        error_log('Failed to send TDE contact form email: ' . $emailResult['message']);

        echo json_encode([
            'success' => false,
            'message' => 'We apologize, but there was a problem sending your message. Please try again later or contact us directly at info@tdetrading.com.au',
            'technical_error' => $emailResult['message']
        ]);
    }
    } catch (Exception $e) {
        // Log the error
        error_log('Contact form error: ' . $e->getMessage());
        
        echo json_encode([
            'success' => false,
            'message' => 'We apologise, but there was a technical problem submitting your message. Please try again later or contact us directly.'
        ]);
    }
} else {
    // Not a supported request method
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. This endpoint only accepts POST requests.'
    ]);
} 