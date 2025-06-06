# TDE Trading Email System - Quick Setup Guide

## Overview

This implementation provides a complete PHP-based email system for the TDE Trading contact form with enhanced validation, security features, and professional email templates.

## What's Been Implemented

### 1. Enhanced PHP Email System
- **Contact Form Handler**: `tde-contact-form-handler.php`
- **Mail Sender**: `tde-mail-sender.php` with PHPMailer
- **Session Management**: `session-handler.php` for CSRF protection
- **Security Configuration**: `.htaccess` for directory protection

### 2. Improved Contact Form
- Updated `contact.html` with enhanced validation attributes
- Added character limits and input types
- Integrated with PHP backend

### 3. Enhanced JavaScript
- **Client-side Validation**: Real-time field validation
- **AJAX Submission**: No page refresh on form submit
- **User Experience**: Loading states, error handling, character counter
- **Email Typo Detection**: Suggests corrections for common email mistakes

### 4. Security Enhancements
- **Rate Limiting**: 1 submission per minute, max 5 per hour
- **Input Sanitization**: XSS and injection protection
- **Spam Detection**: Pattern matching for common spam content
- **CSRF Protection**: Session-based token validation

## Quick Setup Steps

### 1. Configure SMTP Settings

Copy the configuration template:
```bash
cp script/email/config-template.php script/email/config.php
```

Edit `script/email/tde-mail-sender.php` and update SMTP settings:
```php
define('TDE_SMTP_HOST', 'your-smtp-server.com');
define('TDE_SMTP_PORT', 587);
define('TDE_SMTP_USERNAME', 'your-email@tdetrading.com.au');
define('TDE_SMTP_PASSWORD', 'your-smtp-password');
define('TDE_SMTP_ENCRYPTION', 'tls');
```

### 2. Test the System

**Test SMTP Configuration:**
- Open browser and navigate to: `your-domain.com/script/email/tde-mail-sender.php`
- Should return JSON with configuration status

**Test Contact Form:**
- Open browser and navigate to: `your-domain.com/script/email/tde-contact-form-handler.php`
- Should return JSON with endpoint information

**Send Test Email:**
Use browser console:
```javascript
fetch('script/email/tde-mail-sender.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'test',
        test_email: 'your-email@example.com'
    })
}).then(r => r.json()).then(console.log);
```

### 3. Production Setup

1. **Update SMTP credentials** in `tde-mail-sender.php`
2. **Disable debug mode** - Comment out error reporting in `tde-contact-form-handler.php`
3. **Test form submission** on the actual contact page
4. **Verify email delivery** - Check both inbox and spam folders
5. **Monitor error logs** - Check server error logs for any issues

## Features Comparison

### Before (Original)
- ❌ No server-side processing
- ❌ Basic client-side validation only
- ❌ No email sending capability
- ❌ No spam protection
- ❌ No rate limiting

### After (Enhanced)
- ✅ Complete PHP email system
- ✅ Enhanced validation (client + server)
- ✅ Professional branded emails
- ✅ Comprehensive security features
- ✅ Rate limiting and spam protection
- ✅ Real-time user feedback
- ✅ Character counter and typo detection
- ✅ AJAX form submission
- ✅ Error handling and logging

## Validation Improvements

### Name Fields
- Length validation (2-30 characters)
- Character validation (letters, spaces, hyphens, apostrophes)
- Unicode support for international names

### Email Field
- RFC 5321 compliant validation
- Domain DNS validation
- Common typo detection and suggestions
- XSS protection

### Phone Field
- International format support
- Length validation (8-15 digits)
- Format validation with common separators

### Message Field
- Length validation (10-2000 characters)
- Spam pattern detection
- HTML injection protection
- Real-time character counter

## Security Features

### Input Protection
- HTML entity encoding
- XSS prevention
- SQL injection protection
- Script tag removal

### Rate Limiting
- Session-based tracking
- Configurable limits
- Automatic cooldown periods

### Server Security
- Directory access control
- File type restrictions
- PHP security headers
- Error disclosure prevention

## File Structure

```
script/email/
├── tde-contact-form-handler.php    # Main form processor
├── tde-mail-sender.php             # Email sending functionality
├── session-handler.php             # CSRF and session management
├── config-template.php             # Configuration template
├── .htaccess                       # Security configuration
├── README.md                       # Detailed documentation
├── SETUP-GUIDE.md                  # This setup guide
└── PHPMailer/                      # PHPMailer library
    ├── PHPMailer.php
    ├── SMTP.php
    ├── Exception.php
    └── ...

js/
└── contact-form.js                 # Enhanced client-side functionality

contact.html                        # Updated contact form
```

## Common Issues & Solutions

### 1. SMTP Authentication Failed
- Verify SMTP credentials are correct
- Check if hosting provider blocks SMTP connections
- Ensure email account exists and password is correct
- Try different SMTP ports (587 for TLS, 465 for SSL)

### 2. Emails Not Received
- Check spam/junk folders
- Verify recipient email address
- Test with different email providers
- Check server mail logs

### 3. Form Not Submitting
- Check browser console for JavaScript errors
- Verify file permissions on PHP scripts
- Ensure server supports PHP and required extensions
- Check .htaccess configuration

### 4. Permission Errors
- Set proper file permissions (644 for PHP files, 755 for directories)
- Ensure web server can read/execute PHP scripts
- Check ownership of files

## Support

For technical issues:
1. Check the detailed README.md file
2. Review server error logs
3. Test individual components using the testing endpoints
4. Verify SMTP configuration with your email provider

## Next Steps

1. **Customize Email Template**: Modify the HTML template in `tde-mail-sender.php`
2. **Add More Fields**: Extend validation in both PHP and JavaScript
3. **Integrate Analytics**: Track form submissions and conversion rates
4. **Add Captcha**: Implement reCAPTCHA for additional spam protection
5. **Database Logging**: Store submissions in database for follow-up

The system is now ready for production use with proper SMTP configuration! 