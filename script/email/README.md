# TDE Trading Email System

This directory contains the PHP-based email system for handling contact form submissions on the TDE Trading website. The system is based on the AAA City implementation but has been enhanced with improved validation and security features.

## Features

- **Enhanced Validation**: Comprehensive validation for names, emails, phone numbers, and messages
- **Security**: XSS protection, spam detection, rate limiting, and CSRF protection
- **Professional Branding**: TDE Trading branded email templates
- **Rate Limiting**: Prevents spam by limiting submissions (1 per minute, max 5 per hour)
- **Error Handling**: Detailed error logging and user-friendly error messages
- **Multiple Input Support**: Handles both regular form POST and JSON AJAX requests

## Files Overview

### Core Files
- `tde-contact-form-handler.php` - Main contact form processor
- `tde-mail-sender.php` - Email sending functionality using PHPMailer
- `session-handler.php` - CSRF protection and session management
- `.htaccess` - Security configuration and access control

### PHPMailer Directory
- `PHPMailer/` - Contains the PHPMailer library files for SMTP email sending

## Setup Instructions

### 1. SMTP Configuration

Edit `tde-mail-sender.php` and update the SMTP settings:

```php
define('TDE_SMTP_HOST', 'your-smtp-server.com');
define('TDE_SMTP_PORT', 587); // or 465 for SSL
define('TDE_SMTP_USERNAME', 'your-email@tdetrading.com.au');
define('TDE_SMTP_PASSWORD', 'your-smtp-password');
define('TDE_SMTP_ENCRYPTION', 'tls'); // or 'ssl'
```

### 2. Recipient Email

The contact form emails are sent to `info@tdetrading.com.au` by default. To change this, edit the `$recipientEmail` variable in `tde-contact-form-handler.php`.

### 3. Form Integration

Update your contact form to submit to the handler:

```html
<form id="contactForm" action="script/email/tde-contact-form-handler.php" method="POST">
    <input type="text" name="fname" placeholder="First Name" required>
    <input type="text" name="lname" placeholder="Last Name" required>
    <input type="email" name="email" placeholder="Email Address" required>
    <input type="text" name="phone" placeholder="Phone Number" required>
    <textarea name="message" placeholder="Message" required></textarea>
    <button type="submit">Send Message</button>
</form>
```

### 4. JavaScript Integration

For AJAX form submission:

```javascript
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('script/email/tde-contact-form-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
            this.reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
```

## Validation Rules

### Name Fields (First Name, Last Name)
- Minimum 2 characters, maximum 30 characters
- Only letters, spaces, hyphens, apostrophes, and periods allowed
- Unicode support for international names

### Email Address
- Must be a valid email format
- Maximum 254 characters (RFC 5321 standard)
- Domain validation (MX/A record check)
- Common typo detection for popular email domains
- XSS and injection attack prevention

### Phone Number
- Minimum 8 digits, maximum 15 digits
- Allows international formatting with + prefix
- Supports common formatting characters: spaces, dashes, parentheses
- Must contain at least one digit

### Message
- Minimum 10 characters, maximum 2000 characters
- Spam pattern detection
- HTML/script injection prevention
- URL length validation

## Security Features

### Rate Limiting
- Maximum 1 submission per minute per session
- Maximum 5 submissions per hour per session
- Session-based tracking

### Input Sanitization
- HTML entity encoding
- XSS prevention
- SQL injection prevention
- Script tag removal

### CSRF Protection
- Session-based CSRF tokens
- Token validation on form submission

### Server Security
- `.htaccess` configuration for directory protection
- Limited file access
- PHP security settings
- Error handling without information disclosure

## Testing

### Test SMTP Configuration

You can test your SMTP settings by accessing:
```
GET script/email/tde-mail-sender.php
```

This will return the configuration status.

To send a test email:
```javascript
fetch('script/email/tde-mail-sender.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        action: 'test',
        test_email: 'your-email@example.com'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Test Contact Form Handler

Access the handler directly to check status:
```
GET script/email/tde-contact-form-handler.php
```

## Error Handling

The system provides detailed error responses:

### Success Response
```json
{
    "success": true,
    "message": "Thank you for your message! We will get back to you within 24 hours."
}
```

### Error Response
```json
{
    "success": false,
    "message": "Please correct the following issues:",
    "errors": [
        "First name must be at least 2 characters",
        "Please enter a valid email address"
    ]
}
```

### Rate Limit Response
```json
{
    "success": false,
    "message": "Too many submissions. Please wait before trying again.",
    "retry_after": 60
}
```

## Email Template

The system generates branded HTML emails with:
- TDE Trading colors and styling
- Professional layout
- Contact information display
- Timestamp
- Responsive design for mobile email clients

## Production Deployment

### Before Going Live

1. **Update SMTP credentials** in `tde-mail-sender.php`
2. **Disable debug mode** by commenting out error reporting in `tde-contact-form-handler.php`
3. **Test email delivery** using the test functionality
4. **Verify form integration** with your website
5. **Check server permissions** for the script directory
6. **Review security settings** in `.htaccess`

### Server Requirements

- PHP 7.4 or higher
- PHP extensions: `openssl`, `mbstring`, `json`
- SMTP server access
- File write permissions for error logging
- Apache with mod_rewrite (recommended)

### Monitoring

- Check error logs regularly
- Monitor email delivery rates
- Review spam detection patterns
- Update validation rules as needed

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify SMTP credentials
   - Check server hostname and port
   - Ensure SMTP server allows authentication

2. **Form Not Submitting**
   - Check JavaScript console for errors
   - Verify form field names match expected values
   - Ensure proper file permissions

3. **Emails Not Received**
   - Check spam/junk folders
   - Verify recipient email address
   - Review SMTP server logs

4. **Validation Errors**
   - Review validation rules in README
   - Check for special characters in input
   - Verify field length requirements

### Debug Mode

To enable debug mode, uncomment the error reporting lines in `tde-contact-form-handler.php`:

```php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```

**Note**: Always disable debug mode in production.

## Changelog

### Version 1.0.0
- Initial implementation based on AAA City system
- Enhanced validation for TDE Trading requirements
- Improved security features
- Professional email template design
- Comprehensive documentation

## Support

For technical support or questions about this email system, contact the development team or refer to the PHPMailer documentation for SMTP-related issues. 