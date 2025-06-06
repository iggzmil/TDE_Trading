<?php
/**
 * TDE Trading Email Configuration Template
 * 
 * Copy this file to 'config.php' and update the settings below with your actual SMTP credentials.
 * The config.php file will be protected by .htaccess and should not be publicly accessible.
 */

// SMTP Server Configuration
// Update these settings with your actual SMTP provider details

// Example for Gmail SMTP:
// define('TDE_SMTP_HOST', 'smtp.gmail.com');
// define('TDE_SMTP_PORT', 587);
// define('TDE_SMTP_USERNAME', 'your-email@gmail.com');
// define('TDE_SMTP_PASSWORD', 'your-app-password'); // Use App Password for Gmail
// define('TDE_SMTP_ENCRYPTION', 'tls');

// Example for cPanel/WHM SMTP:
// define('TDE_SMTP_HOST', 'mail.yourdomain.com');
// define('TDE_SMTP_PORT', 587);
// define('TDE_SMTP_USERNAME', 'noreply@yourdomain.com');
// define('TDE_SMTP_PASSWORD', 'your-email-password');
// define('TDE_SMTP_ENCRYPTION', 'tls');

// Example for Microsoft 365/Outlook SMTP:
// define('TDE_SMTP_HOST', 'smtp.office365.com');
// define('TDE_SMTP_PORT', 587);
// define('TDE_SMTP_USERNAME', 'your-email@yourdomain.com');
// define('TDE_SMTP_PASSWORD', 'your-email-password');
// define('TDE_SMTP_ENCRYPTION', 'tls');

// TDE Trading Default Configuration (Update these values)
define('TDE_SMTP_HOST', 'mail.tdetrading.com.au');
define('TDE_SMTP_PORT', 587); // 587 for TLS, 465 for SSL
define('TDE_SMTP_USERNAME', 'noreply@tdetrading.com.au');
define('TDE_SMTP_PASSWORD', 'your_actual_smtp_password_here');
define('TDE_SMTP_ENCRYPTION', 'tls'); // 'tls' or 'ssl'

// Email Settings
define('TDE_FROM_EMAIL', TDE_SMTP_USERNAME);
define('TDE_FROM_NAME', 'TDE Trading Website');
define('TDE_REPLY_TO_EMAIL', 'info@tdetrading.com.au');

// Contact Form Settings
define('TDE_CONTACT_RECIPIENT', 'info@tdetrading.com.au');
define('TDE_CONTACT_SUBJECT_PREFIX', 'TDE Trading - Website Contact: ');

// Security Settings
define('TDE_RATE_LIMIT_SUBMISSIONS', 5); // Max submissions per hour
define('TDE_RATE_LIMIT_INTERVAL', 3600); // Time window in seconds (3600 = 1 hour)
define('TDE_MIN_SUBMISSION_INTERVAL', 60); // Minimum seconds between submissions

// Validation Settings
define('TDE_MAX_MESSAGE_LENGTH', 2000);
define('TDE_MIN_MESSAGE_LENGTH', 10);
define('TDE_MAX_NAME_LENGTH', 30);
define('TDE_MIN_NAME_LENGTH', 2);
define('TDE_MAX_EMAIL_LENGTH', 254);

// Debug Settings (Set to false in production)
define('TDE_DEBUG_MODE', false);
define('TDE_LOG_SUBMISSIONS', true);

// Spam Protection Settings
define('TDE_ENABLE_SPAM_DETECTION', true);
define('TDE_ENABLE_DNS_VALIDATION', true);

/**
 * Instructions for setup:
 * 
 * 1. Copy this file to 'config.php' in the same directory
 * 2. Update the SMTP settings above with your actual email provider details
 * 3. Update the recipient email address for contact form submissions
 * 4. Test the configuration using the test email functionality
 * 5. Set TDE_DEBUG_MODE to false for production use
 * 
 * Common SMTP Providers:
 * 
 * Gmail:
 * - Host: smtp.gmail.com
 * - Port: 587 (TLS) or 465 (SSL)
 * - Use App Password instead of regular password
 * - Enable 2-factor authentication first
 * 
 * Microsoft 365/Outlook:
 * - Host: smtp.office365.com
 * - Port: 587
 * - Use your full email address as username
 * 
 * cPanel/WHM Hosting:
 * - Host: mail.yourdomain.com (or as provided by host)
 * - Port: 587 (TLS) or 465 (SSL)
 * - Create email account in cPanel first
 * 
 * Troubleshooting:
 * 
 * - If emails aren't sending, check SMTP credentials
 * - Verify your hosting provider allows SMTP connections
 * - Check spam/junk folders for test emails
 * - Enable debug mode temporarily to see detailed error messages
 * - Ensure PHP has openssl extension enabled for SMTP
 */ 