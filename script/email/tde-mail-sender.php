<?php
/**
 * TDE Trading Mail Sender
 * 
 * Uses PHPMailer to send emails through SMTP with TDE Trading branding
 */

// Email configuration - Update these settings for your SMTP provider
define('TDE_SMTP_HOST', 'mail.tdetrading.com.au'); // Update with your SMTP host
define('TDE_SMTP_PORT', 587); // Port 587 for STARTTLS, 465 for SSL
define('TDE_SMTP_USERNAME', 'noreply@tdetrading.com.au'); // Update with your SMTP username
define('TDE_SMTP_PASSWORD', 'your_smtp_password'); // Update with your SMTP password
define('TDE_SMTP_ENCRYPTION', 'tls'); // tls or ssl

// Check if PHPMailer is already included
if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    // If PHPMailer is not available, include the PHPMailer class via composer autoload
    // or directly include the PHPMailer files
    if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
        require_once __DIR__ . '/../../vendor/autoload.php';
    } else {
        // If no composer autoload, include PHPMailer classes directly
        require_once __DIR__ . '/PHPMailer/Exception.php';
        require_once __DIR__ . '/PHPMailer/PHPMailer.php';
        require_once __DIR__ . '/PHPMailer/SMTP.php';
    }
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

/**
 * Create HTML email content for TDE Trading contact form submissions
 * 
 * @param array $formData The sanitized form data
 * @return string HTML email content
 */
function createTDEContactEmailHtml($formData) {
    // Get form data
    $fname = isset($formData['fname']) ? htmlspecialchars($formData['fname']) : 'Not provided';
    $lname = isset($formData['lname']) ? htmlspecialchars($formData['lname']) : 'Not provided';
    $fullName = trim($fname . ' ' . $lname);
    $email = isset($formData['email']) ? htmlspecialchars($formData['email']) : 'Not provided';
    $phone = isset($formData['phone']) ? htmlspecialchars($formData['phone']) : 'Not provided';
    $message = isset($formData['message']) ? nl2br(htmlspecialchars($formData['message'])) : 'Not provided';
    
    // Get current timestamp
    $timestamp = date('F j, Y \a\t g:i A T');
    
    // Create HTML email content with TDE Trading branding
    $html = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TDE Trading Contact Form Submission</title>
        <style>
            body { 
                font-family: "Fustat", Arial, sans-serif; 
                line-height: 1.6; 
                color: #042A2D; 
                margin: 0; 
                padding: 0; 
                background-color: #F2F1ED;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(263deg, #73ED7C 0.16%, #019297 99.84%);
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
            .header p {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content { 
                padding: 30px 20px; 
                background-color: #ffffff; 
            }
            .field { 
                margin-bottom: 20px; 
                border-bottom: 1px solid #DFE1DE;
                padding-bottom: 15px;
            }
            .field:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .label { 
                font-weight: 700; 
                color: #042A2D;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                display: block;
            }
            .value {
                font-size: 16px;
                color: #042A2D;
                margin: 0;
            }
            .message-field .value {
                background-color: #F2F1ED;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #73ED7C;
            }
            .footer { 
                background-color: #042A2D;
                color: #ffffff;
                font-size: 12px; 
                text-align: center; 
                padding: 20px; 
            }
            .footer p {
                margin: 5px 0;
            }
            .timestamp {
                background-color: #F2F1ED;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                color: #8F8F8F;
                text-align: center;
            }
            .highlight {
                color: #019297;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>TDE Trading</h1>
                <p>New Contact Form Submission</p>
            </div>
            <div class="content">
                <div class="timestamp">
                    <strong>Received:</strong> ' . $timestamp . '
                </div>
                
                <div class="field">
                    <span class="label">Contact Name</span>
                    <p class="value"><strong>' . $fullName . '</strong></p>
                </div>
                
                <div class="field">
                    <span class="label">Email Address</span>
                    <p class="value"><a href="mailto:' . $email . '" class="highlight">' . $email . '</a></p>
                </div>
                
                <div class="field">
                    <span class="label">Phone Number</span>
                    <p class="value"><a href="tel:' . str_replace(' ', '', $phone) . '" class="highlight">' . $phone . '</a></p>
                </div>
                
                <div class="field message-field">
                    <span class="label">Message</span>
                    <div class="value">' . $message . '</div>
                </div>
            </div>
            <div class="footer">
                <p><strong>TDE Trading - Professional Trading Education</strong></p>
                <p>This email was automatically generated from the website contact form.</p>
                <p>Phone: <a href="tel:+61430333813" style="color: #73ED7C;">(+61) 430 333 813</a> | 
                   Email: <a href="mailto:info@tdetrading.com.au" style="color: #73ED7C;">info@tdetrading.com.au</a></p>
            </div>
        </div>
    </body>
    </html>
    ';
    
    return $html;
}

/**
 * Send an email using TDE Trading's SMTP server
 *
 * @param string $to Recipient email address
 * @param string $subject Email subject
 * @param string $htmlBody HTML email body content
 * @param string $fromName Display name for the sender
 * @param string $replyTo Optional reply-to email address
 * @return array Result with success flag and message
 */
function sendTDEEmail($to, $subject, $htmlBody, $fromName = 'TDE Trading Website', $replyTo = '') {
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = 0;                      // 0 = off, 1 = client messages, 2 = client and server messages
        $mail->isSMTP();                           // Send using SMTP
        $mail->Host       = TDE_SMTP_HOST;         // Set the SMTP server
        $mail->SMTPAuth   = true;                  // Enable SMTP authentication
        $mail->Username   = TDE_SMTP_USERNAME;     // SMTP username
        $mail->Password   = TDE_SMTP_PASSWORD;     // SMTP password
        $mail->SMTPSecure = TDE_SMTP_ENCRYPTION;   // Enable TLS/SSL encryption
        $mail->Port       = TDE_SMTP_PORT;         // TCP port to connect to

        // Set timeout values
        $mail->Timeout = 30;
        $mail->SMTPKeepAlive = false;

        // Recipients
        $mail->setFrom(TDE_SMTP_USERNAME, $fromName);
        $mail->addAddress($to);                    // Add a recipient
        
        // Add reply-to if provided
        if (!empty($replyTo)) {
            $mail->addReplyTo($replyTo);
        }

        // Content
        $mail->isHTML(true);                       // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        
        // Generate plain text version from HTML
        $plainText = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));
        $plainText = html_entity_decode($plainText, ENT_QUOTES, 'UTF-8');
        $mail->AltBody = $plainText;
        
        // Additional headers for better deliverability
        $mail->addCustomHeader('X-Mailer', 'TDE Trading Contact Form');
        $mail->addCustomHeader('X-Priority', '3'); // Normal priority
        
        // Send the email
        $mail->send();
        
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
    } catch (Exception $e) {
        // Log the detailed error for debugging
        error_log("TDE Mail Error: " . $e->getMessage());
        
        return [
            'success' => false,
            'message' => "Email could not be sent. Error: {$e->getMessage()}"
        ];
    }
}

/**
 * Send a test email to verify SMTP configuration
 *
 * @param string $testEmail Email address to send test to
 * @return array Result with success flag and message
 */
function sendTDETestEmail($testEmail) {
    $testHtml = '
    <!DOCTYPE html>
    <html>
    <head>
        <title>TDE Trading SMTP Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>TDE Trading SMTP Test</h2>
        <p>This is a test email to verify that your TDE Trading SMTP configuration is working correctly.</p>
        <p><strong>Test sent at:</strong> ' . date('Y-m-d H:i:s T') . '</p>
        <p>If you received this email, your SMTP settings are configured properly.</p>
    </body>
    </html>
    ';

    return sendTDEEmail(
        $testEmail,
        'TDE Trading SMTP Test - ' . date('Y-m-d H:i:s'),
        $testHtml,
        'TDE Trading System Test'
    );
}

// API endpoint handler if file is accessed directly
if (basename($_SERVER['SCRIPT_FILENAME']) == basename(__FILE__)) {
    header('Content-Type: application/json');

    // Check if it's a POST request
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Handle test email request
        if (isset($data['action']) && $data['action'] === 'test') {
            if (!isset($data['test_email'])) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Test email address is required'
                ]);
                exit;
            }

            $result = sendTDETestEmail($data['test_email']);
            echo json_encode($result);
            exit;
        }

        // Validate required fields for regular email
        if (!isset($data['to']) || !isset($data['subject']) || !isset($data['message'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Missing required fields (to, subject, message)'
            ]);
            exit;
        }

        // Send email
        $result = sendTDEEmail(
            $data['to'],
            $data['subject'],
            $data['message'],
            $data['fromName'] ?? 'TDE Trading',
            $data['replyTo'] ?? ''
        );

        // Return result
        echo json_encode($result);
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Return configuration status (without sensitive info)
        echo json_encode([
            'success' => true,
            'message' => 'TDE Trading Mail Sender is ready',
            'smtp_host' => TDE_SMTP_HOST,
            'smtp_port' => TDE_SMTP_PORT,
            'smtp_encryption' => TDE_SMTP_ENCRYPTION,
            'phpmailer_available' => class_exists('PHPMailer\PHPMailer\PHPMailer')
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'This endpoint accepts GET and POST requests only'
        ]);
    }
} 