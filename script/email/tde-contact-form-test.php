<?php
/**
 * Simple Contact Form Test Handler for TDE Trading
 * 
 * This is a simplified version to test form submission without external dependencies
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session
session_start();

// Simple reCAPTCHA validation (for testing - just check if response exists)
function verifyRecaptcha($recaptchaResponse) {
    // For testing, just check if response exists
    return !empty($recaptchaResponse);
}

// Simple rate limiting
function checkRateLimit() {
    if (!isset($_SESSION['last_submission'])) {
        $_SESSION['last_submission'] = time();
        return true;
    }
    
    $timeSinceLastSubmission = time() - $_SESSION['last_submission'];
    
    if ($timeSinceLastSubmission < 10) { // 10 seconds for testing
        return false;
    }
    
    $_SESSION['last_submission'] = time();
    return true;
}

// Basic validation
function validateContactForm($data) {
    $errors = [];
    
    $requiredFields = ['fname', 'lname', 'email', 'phone', 'message'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[] = ucfirst($field) . ' is required';
        }
    }
    
    if (isset($data['email']) && !empty($data['email'])) {
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }
    }
    
    return $errors;
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check rate limiting
        if (!checkRateLimit()) {
            echo json_encode([
                'success' => false,
                'message' => 'Please wait before submitting again.',
                'test_mode' => true
            ]);
            exit;
        }
        
        // Get form data
        $requestData = $_POST;
        
        if (empty($requestData)) {
            echo json_encode([
                'success' => false,
                'message' => 'No form data received',
                'test_mode' => true
            ]);
            exit;
        }
        
        // Sanitize data
        $sanitizedData = [];
        foreach ($requestData as $key => $value) {
            if (is_string($value)) {
                $sanitizedData[$key] = trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
            } else {
                $sanitizedData[$key] = $value;
            }
        }
        
        // Validate reCAPTCHA
        $recaptchaResponse = $sanitizedData['g-recaptcha-response'] ?? '';
        if (!verifyRecaptcha($recaptchaResponse)) {
            echo json_encode([
                'success' => false,
                'message' => 'Please complete the reCAPTCHA verification.',
                'test_mode' => true
            ]);
            exit;
        }
        
        // Validate form data
        $errors = validateContactForm($sanitizedData);
        
        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'message' => 'Please correct the following issues:',
                'errors' => $errors,
                'test_mode' => true
            ]);
            exit;
        }
        
        // For testing, just return success without sending email
        echo json_encode([
            'success' => true,
            'message' => 'Test successful! Form data received and validated.',
            'test_mode' => true,
            'received_data' => [
                'fname' => $sanitizedData['fname'],
                'lname' => $sanitizedData['lname'],
                'email' => $sanitizedData['email'],
                'phone' => $sanitizedData['phone'],
                'message' => substr($sanitizedData['message'], 0, 50) . '...'
            ]
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Server error occurred',
            'error' => $e->getMessage(),
            'test_mode' => true
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed',
        'test_mode' => true
    ]);
}
?> 