<?php
/**
 * Meta Tags Helper for TDE Trading
 * Generates comprehensive Open Graph and meta tags for all pages
 */

function generateMetaTags($page = 'home', $customData = []) {
    $baseUrl = 'https://www.tdetrading.com.au';
    $siteName = 'TDE Trading';
    
    // Default meta data
    $defaults = [
        'title' => 'TDE Trading | Professional Trading Education Australia',
        'description' => 'Professional trading education and mentorship for Forex, Crypto, Commodities, and Indices. Join our community of successful traders.',
        'image' => $baseUrl . '/images/og-default.jpg',
        'type' => 'website',
        'locale' => 'en_AU'
    ];
    
    // Page-specific meta data
    $pageData = [
        'home' => [
            'title' => 'Welcome to TDE Trading | Professional Trading Education Australia',
            'description' => 'Unlock your trading edge with TDE Trading. Comprehensive education, expert mentorship, and a supportive community for Forex, Crypto, Commodities & Indices.',
            'image' => $baseUrl . '/images/og-home.jpg'
        ],
        'pricing' => [
            'title' => 'Trading Education Pricing | TDE Trading Membership Plans',
            'description' => 'Affordable trading education plans starting from $99/month. Get access to expert mentorship, live trading sessions, and comprehensive educational resources.',
            'image' => $baseUrl . '/images/og-pricing.jpg'
        ],
        'contact' => [
            'title' => 'Contact TDE Trading | Get Started with Professional Trading Education',
            'description' => 'Ready to start your trading journey? Contact TDE Trading today for expert guidance in Forex, Crypto, Commodities, and Indices trading.',
            'image' => $baseUrl . '/images/og-contact.jpg'
        ],
        'faqs' => [
            'title' => 'Frequently Asked Questions | TDE Trading Support',
            'description' => 'Find answers to common questions about TDE Trading education programs, membership benefits, and trading strategies.',
            'image' => $baseUrl . '/images/og-faqs.jpg'
        ],
        'testimonial' => [
            'title' => 'Success Stories | TDE Trading Student Testimonials',
            'description' => 'Read what our successful traders say about TDE Trading education and mentorship programs. Real results from real traders.',
            'image' => $baseUrl . '/images/og-testimonials.jpg'
        ]
    ];
    
    // Merge page data with defaults
    $meta = array_merge($defaults, $pageData[$page] ?? [], $customData);
    
    // Generate meta tags HTML
    $html = "
    <!-- Primary Meta Tags -->
    <meta name=\"title\" content=\"{$meta['title']}\">
    <meta name=\"description\" content=\"{$meta['description']}\">
    
    <!-- Open Graph / Facebook -->
    <meta property=\"og:type\" content=\"{$meta['type']}\">
    <meta property=\"og:url\" content=\"{$baseUrl}\">
    <meta property=\"og:title\" content=\"{$meta['title']}\">
    <meta property=\"og:description\" content=\"{$meta['description']}\">
    <meta property=\"og:image\" content=\"{$meta['image']}\">
    <meta property=\"og:image:width\" content=\"1200\">
    <meta property=\"og:image:height\" content=\"630\">
    <meta property=\"og:image:alt\" content=\"TDE Trading - Professional Trading Education\">
    <meta property=\"og:site_name\" content=\"{$siteName}\">
    <meta property=\"og:locale\" content=\"{$meta['locale']}\">
    
    <!-- Twitter -->
    <meta property=\"twitter:card\" content=\"summary_large_image\">
    <meta property=\"twitter:url\" content=\"{$baseUrl}\">
    <meta property=\"twitter:title\" content=\"{$meta['title']}\">
    <meta property=\"twitter:description\" content=\"{$meta['description']}\">
    <meta property=\"twitter:image\" content=\"{$meta['image']}\">
    <meta property=\"twitter:image:alt\" content=\"TDE Trading - Professional Trading Education\">
    
    <!-- Additional Meta Tags -->
    <meta name=\"author\" content=\"TDE Trading\">
    <meta name=\"publisher\" content=\"TDE Trading\">
    <meta name=\"robots\" content=\"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1\">
    <meta name=\"googlebot\" content=\"index, follow\">
    <meta name=\"bingbot\" content=\"index, follow\">
    <link rel=\"canonical\" href=\"{$baseUrl}\">
    ";
    
    return $html;
}

// Function to generate Open Graph images programmatically
function generateOGImage($title, $subtitle, $outputPath) {
    // This would require GD or ImageMagick library
    // For now, we'll create a placeholder function
    
    $width = 1200;
    $height = 630;
    
    if (extension_loaded('gd')) {
        // Create image
        $image = imagecreatetruecolor($width, $height);
        
        // Colors
        $bgGradientStart = imagecolorallocate($image, 4, 42, 45); // Primary color
        $bgGradientEnd = imagecolorallocate($image, 115, 237, 124); // Accent color
        $white = imagecolorallocate($image, 255, 255, 255);
        
        // Create gradient background
        for ($i = 0; $i < $height; $i++) {
            $color = imagecolorallocate($image,
                4 + ($i / $height) * (115 - 4),
                42 + ($i / $height) * (237 - 42),
                45 + ($i / $height) * (124 - 45)
            );
            imageline($image, 0, $i, $width, $i, $color);
        }
        
        // Add logo (if exists)
        $logoPath = dirname(__DIR__) . '/images/TDE-Trading-logo.png';
        if (file_exists($logoPath)) {
            $logo = imagecreatefrompng($logoPath);
            if ($logo) {
                $logoWidth = imagesx($logo);
                $logoHeight = imagesy($logo);
                $newLogoWidth = 200;
                $newLogoHeight = ($logoHeight / $logoWidth) * $newLogoWidth;
                
                imagecopyresampled($image, $logo, 
                    50, 50, 
                    0, 0, 
                    $newLogoWidth, $newLogoHeight, 
                    $logoWidth, $logoHeight
                );
            }
        }
        
        // Add text
        $fontPath = 'C:/Windows/Fonts/arial.ttf'; // Adjust path as needed
        if (file_exists($fontPath)) {
            // Title
            imagettftext($image, 48, 0, 50, 350, $white, $fontPath, $title);
            
            // Subtitle
            imagettftext($image, 24, 0, 50, 420, $white, $fontPath, $subtitle);
            
            // Website URL
            imagettftext($image, 18, 0, 50, 550, $white, $fontPath, 'www.tdetrading.com.au');
        }
        
        // Save image
        imagejpeg($image, $outputPath, 90);
        imagedestroy($image);
        
        return true;
    }
    
    return false;
}