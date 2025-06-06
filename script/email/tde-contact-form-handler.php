<?php
/**
 * Contact Form Handler for TDE Trading
 *
 * This script processes contact form submissions from the website
 * and sends emails using the TDE Trading mail server.
 */

// Include the TDE mail sender
require_once __DIR__ . '/tde-mail-sender.php';

// Enable error reporting for debugging (comment this out in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

// Function to validate form data
function validateContactForm($data) {
    $errors = [];

    // Required fields
    $requiredFields = ['fname', 'lname', 'email', 'phone', 'message'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[] = ucfirst(str_replace('fname', 'first name', str_replace('lname', 'last name', $field))) . ' is required';
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
        if (!preg_match('/^[A-Za-z\s\-\']+$/', $fname)) {
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

        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        if (!preg_match('/^[A-Za-z\s\-\']+$/', $lname)) {
            $errors[] = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        }
    }

    // Email validation
    if (isset($data['email']) && !empty($data['email'])) {
        $email = trim($data['email']);

        // Basic email validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }

        // Additional email validation (domain check)
        $parts = explode('@', $email);
        if (count($parts) === 2) {
            $domain = $parts[1];
            if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
                $errors[] = 'Email domain appears to be invalid';
            }
        }
    }

    // Phone validation
    if (isset($data['phone']) && !empty($data['phone'])) {
        $phone = trim($data['phone']);

        // Remove all non-numeric characters for validation
        $numericPhone = preg_replace('/[^0-9]/', '', $phone);

        // Check length (Australian phone numbers)
        if (strlen($numericPhone) < 8) {
            $errors[] = 'Phone number must be at least 8 digits';
        } elseif (strlen($numericPhone) > 15) {
            $errors[] = 'Phone number must be no more than 15 digits';
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
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'php_version' => PHP_VERSION,
    'server_vars' => [
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown',
        'query_string' => $_SERVER['QUERY_STRING'] ?? 'none',
        'http_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]
];

// Handle GET request (for testing only)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'This endpoint accepts POST requests only',
        'debug' => $debugInfo
    ]);
    exit;
}

// Process both normal form POST and AJAX JSON POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

    // If FormData via fetch API
    if (empty($requestData) && !empty($_POST)) {
        $requestData = $_POST;
    }

    // Check if we actually have any data
    if (empty($requestData)) {
        echo json_encode([
            'success' => false,
            'message' => 'No form data received',
            'raw_post' => $_POST,
            'php_input' => file_get_contents('php://input'),
            'debug' => $debugInfo
        ]);
        exit;
    }

    // Sanitize input data
    $sanitizedData = [];
    foreach ($requestData as $key => $value) {
        // Sanitize string values
        if (is_string($value)) {
            $sanitizedData[$key] = trim(strip_tags($value));
        } else {
            $sanitizedData[$key] = $value;
        }
    }

    // Validate form data
    $errors = validateContactForm($sanitizedData);

    if (!empty($errors)) {
        // Format the error message to be more user-friendly
        $errorMessage = 'Please correct the following issues:';

        // Return the detailed error information
        echo json_encode([
            'success' => false,
            'message' => $errorMessage,
            'errors' => $errors,
            'debug' => $debugInfo
        ]);
        exit;
    }

    // Create HTML email content
    $emailHtml = createContactEmailHtml($sanitizedData);

    // Set the recipient email
    $recipientEmail = 'info@tdetrading.com.au'; // Send all form submissions to this email
    
    // Set the subject format
    $emailSubject = 'TDE Trading Contact Form Submission';

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
        // Return success
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message. We will get back to you shortly.',
            'debug' => $debugInfo
        ]);
    } else {
        // Log the error
        error_log('Failed to send contact form email: ' . $emailResult['message']);

        // Return error
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, we encountered a problem sending your message. Please try again later or contact us directly.',
            'error_details' => $emailResult['message'],
            'debug' => $debugInfo
        ]);
    }
} else {
    // Not a supported request method
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. This endpoint only accepts POST requests.',
        'debug' => $debugInfo
    ]);
} 