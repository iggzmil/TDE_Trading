<?php
/**
 * Dynamic Sitemap Generator for TDE Trading
 * 
 * This script automatically generates an XML sitemap based on all HTML files
 * in the website directory, with proper priorities and change frequencies.
 * 
 * Fixed version: Works without SimpleXML extension
 */

// Configuration
$domain = 'https://www.tdetrading.com.au';
$rootPath = dirname(__DIR__); // Parent directory of script folder

// Page priorities and change frequencies
$pageConfig = [
    'index.html' => ['priority' => 1.0, 'changefreq' => 'weekly'],
    'pricing.html' => ['priority' => 0.9, 'changefreq' => 'monthly'],
    'testimonial.html' => ['priority' => 0.8, 'changefreq' => 'monthly'],
    'contact.html' => ['priority' => 0.8, 'changefreq' => 'monthly'],
    'faqs.html' => ['priority' => 0.7, 'changefreq' => 'monthly'],
    'selection-monthly.html' => ['priority' => 0.7, 'changefreq' => 'monthly'],
    'selection-yearly.html' => ['priority' => 0.7, 'changefreq' => 'monthly'],
    'disclaimer.html' => ['priority' => 0.5, 'changefreq' => 'yearly'],
    'privacy-policy.html' => ['priority' => 0.5, 'changefreq' => 'yearly'],
    'terms-conditions.html' => ['priority' => 0.5, 'changefreq' => 'yearly'],
    'payment-monthly.html' => ['priority' => 0.3, 'changefreq' => 'yearly'],
    'payment-yearly.html' => ['priority' => 0.3, 'changefreq' => 'yearly'],
    'payment-success.html' => ['priority' => 0.2, 'changefreq' => 'yearly'],
    'payment-cancelled.html' => ['priority' => 0.2, 'changefreq' => 'yearly'],
];

// Default values for pages not in config
$defaultPriority = 0.5;
$defaultChangefreq = 'monthly';

/**
 * Get all HTML files in the root directory
 */
function getHtmlFiles($dir) {
    $files = [];
    
    // Check if directory exists
    if (!is_dir($dir)) {
        echo "Error: Directory not found: $dir\n";
        return $files;
    }
    
    // Scan directory for HTML files
    $allFiles = scandir($dir);
    
    foreach ($allFiles as $file) {
        // Check if it's an HTML file
        if (pathinfo($file, PATHINFO_EXTENSION) === 'html') {
            $files[] = $file;
        }
    }
    
    // Sort files with index.html first
    usort($files, function($a, $b) {
        if ($a === 'index.html') return -1;
        if ($b === 'index.html') return 1;
        return strcmp($a, $b);
    });
    
    return $files;
}

/**
 * Get the last modified date of a file
 */
function getLastModified($filepath) {
    if (file_exists($filepath)) {
        return date('Y-m-d', filemtime($filepath));
    }
    return date('Y-m-d');
}

/**
 * Generate the XML sitemap using string concatenation (no SimpleXML required)
 */
function generateSitemapString($domain, $rootPath, $pageConfig, $defaultPriority, $defaultChangefreq) {
    // Start XML document
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    
    $htmlFiles = getHtmlFiles($rootPath);
    $urlCount = 0;
    
    foreach ($htmlFiles as $file) {
        // Skip certain files that shouldn't be in sitemap
        $skipFiles = ['404.html', 'error.html', 'test.html'];
        if (in_array($file, $skipFiles)) {
            continue;
        }
        
        // Build the full URL
        $loc = $domain . '/' . ($file === 'index.html' ? '' : $file);
        
        // Get last modified date
        $lastmod = getLastModified($rootPath . '/' . $file);
        
        // Get priority and changefreq from config or use defaults
        if (isset($pageConfig[$file])) {
            $priority = $pageConfig[$file]['priority'];
            $changefreq = $pageConfig[$file]['changefreq'];
        } else {
            $priority = $defaultPriority;
            $changefreq = $defaultChangefreq;
        }
        
        // Add URL entry
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($loc) . "</loc>\n";
        $xml .= "    <lastmod>" . $lastmod . "</lastmod>\n";
        $xml .= "    <changefreq>" . $changefreq . "</changefreq>\n";
        $xml .= "    <priority>" . number_format($priority, 1) . "</priority>\n";
        $xml .= "  </url>\n";
        
        $urlCount++;
    }
    
    // Close XML document
    $xml .= '</urlset>';
    
    echo "Generated sitemap with $urlCount URLs\n";
    
    return $xml;
}

/**
 * Save the sitemap to file
 */
function saveSitemap($content, $filepath) {
    $result = file_put_contents($filepath, $content);
    if ($result !== false) {
        echo "Sitemap saved successfully to: $filepath\n";
        echo "File size: " . number_format(strlen($content)) . " bytes\n";
        return true;
    } else {
        echo "Error: Failed to save sitemap to: $filepath\n";
        return false;
    }
}

// Main execution
echo "TDE Trading Sitemap Generator\n";
echo "==============================\n\n";

try {
    // Check if we're running from web or CLI
    $isWeb = (php_sapi_name() !== 'cli');
    
    if ($isWeb) {
        // Set content type for web output
        header('Content-Type: text/plain; charset=utf-8');
        echo "Running from web browser...\n\n";
    }
    
    echo "Configuration:\n";
    echo "- Domain: $domain\n";
    echo "- Root Path: $rootPath\n";
    echo "- Script Path: " . __DIR__ . "\n\n";
    
    // Generate sitemap
    echo "Generating sitemap...\n";
    $sitemapContent = generateSitemapString($domain, $rootPath, $pageConfig, $defaultPriority, $defaultChangefreq);
    
    // Save main sitemap
    $sitemapPath = $rootPath . '/sitemap.xml';
    if (saveSitemap($sitemapContent, $sitemapPath)) {
        echo "\n✅ Main sitemap generated successfully!\n";
        
        // Create sitemap index
        $indexContent = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $indexContent .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        $indexContent .= '  <sitemap>' . "\n";
        $indexContent .= '    <loc>' . $domain . '/sitemap.xml</loc>' . "\n";
        $indexContent .= '    <lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
        $indexContent .= '  </sitemap>' . "\n";
        $indexContent .= '</sitemapindex>';
        
        $indexPath = $rootPath . '/sitemap-index.xml';
        if (saveSitemap($indexContent, $indexPath)) {
            echo "✅ Sitemap index generated successfully!\n";
        }
        
        // Update robots.txt content suggestion
        echo "\n" . str_repeat('=', 50) . "\n";
        echo "ROBOTS.TXT UPDATE SUGGESTION\n";
        echo str_repeat('=', 50) . "\n";
        echo "Add these lines to your robots.txt file:\n\n";
        echo "Sitemap: $domain/sitemap.xml\n";
        echo "Sitemap: $domain/sitemap-index.xml\n";
        echo str_repeat('=', 50) . "\n";
        
        // Provide submission instructions
        echo "\nNEXT STEPS:\n";
        echo str_repeat('-', 30) . "\n";
        echo "1. ✅ Sitemap has been generated at: /sitemap.xml\n";
        echo "2. 📤 Submit to Google Search Console:\n";
        echo "   https://search.google.com/search-console/sitemaps\n";
        echo "3. 📤 Submit to Bing Webmaster Tools:\n";
        echo "   https://www.bing.com/webmasters/sitemaps\n";
        echo "4. ✅ Your robots.txt already includes the sitemap reference\n";
        echo "\n";
        
        if ($isWeb) {
            echo "\n📁 View your sitemap: $domain/sitemap.xml\n";
        }
        
    } else {
        echo "\n❌ Error: Failed to save sitemap\n";
    }
    
} catch (Exception $e) {
    echo "\n❌ Error generating sitemap: " . $e->getMessage() . "\n";
    if ($isWeb) {
        http_response_code(500);
    }
}

// Add timestamp
echo "\nGenerated on: " . date('Y-m-d H:i:s') . "\n";