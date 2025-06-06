# TDE Trading Contact Form Email System

This directory contains the PHP scripts needed to handle contact form submissions from the TDE Trading website and send emails using SMTP authentication.

## Files

- `tde-contact-form-handler.php`: Processes form submissions and sends emails
- `tde-mail-sender.php`: Core functionality for sending emails via SMTP
- `session-handler.php`: Manages sessions and CSRF protection
- `PHPMailer/`: Directory containing PHPMailer library files

## Implementation Details

### Authentication

The system uses SMTP authentication to send emails through the TDE Trading mail server. The credentials are configured in `tde-mail-sender.php`.

### Email Sending

Emails are sent using PHPMailer with SMTP authentication. The system supports HTML emails and automatically generates plain text versions.

### Security

- CSRF protection is implemented to prevent cross-site request forgery attacks
- Input validation is performed on all form fields
- Error handling and logging are implemented

## Usage

### Contact Form

The contact form on the website (`contact.html`) is configured to submit to the `tde-contact-form-handler.php` script. The form includes the following fields:

- First Name
- Last Name
- Email Address
- Phone Number
- Message

## Dependencies

- PHPMailer Library (included)
- PHP 7.4 or higher

## Server Requirements

- PHP with cURL extension enabled
- SMTP server access (configured for TDE Trading)
- Proper file permissions for reading/writing

## Configuration

The email configuration is set in `tde-mail-sender.php`:

- SMTP Host: mail.tdetrading.com.au
- SMTP Port: 587 (TLS)
- Authentication: Yes
- Encryption: TLS

## Troubleshooting

If emails are not being sent, check the following:

1. Verify SMTP credentials are correct
2. Check server error logs for any PHP errors
3. Ensure the SMTP server is accessible from the web server
4. Verify firewall settings allow outbound SMTP connections on port 587 