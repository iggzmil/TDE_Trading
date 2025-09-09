<?php
/**
 * Dynamic Sitemap Generator for TDE Trading
 * 
 * This script automatically generates an XML sitemap based on all HTML files
 * in the website directory, with proper priorities and change frequencies.
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
    $iterator = new DirectoryIterator($dir);
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'html') {
            $files[] = $file->getFilename();
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
 * Generate the XML sitemap
 */
function generateSitemap($domain, $rootPath, $pageConfig, $defaultPriority, $defaultChangefreq) {
    $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    
    $htmlFiles = getHtmlFiles($rootPath);
    
    foreach ($htmlFiles as $file) {
        // Skip certain files that shouldn't be in sitemap
        $skipFiles = ['404.html', 'error.html', 'test.html'];
        if (in_array($file, $skipFiles)) {
            continue;
        }
        
        $url = $xml->addChild('url');
        
        // Build the full URL
        $loc = $domain . '/' . ($file === 'index.html' ? '' : $file);
        $url->addChild('loc', htmlspecialchars($loc));
        
        // Add last modified date
        $lastmod = getLastModified($rootPath . '/' . $file);
        $url->addChild('lastmod', $lastmod);
        
        // Get priority and changefreq from config or use defaults
        if (isset($pageConfig[$file])) {
            $priority = $pageConfig[$file]['priority'];
            $changefreq = $pageConfig[$file]['changefreq'];
        } else {
            $priority = $defaultPriority;
            $changefreq = $defaultChangefreq;
        }
        
        $url->addChild('changefreq', $changefreq);
        $url->addChild('priority', $priority);
    }
    
    // Format the XML with proper indentation
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());
    
    return $dom->saveXML();
}

/**
 * Save the sitemap to file
 */
function saveSitemap($content, $filepath) {
    $result = file_put_contents($filepath, $content);
    return $result !== false;
}

// Generate and save the sitemap
try {
    $sitemapContent = generateSitemap($domain, $rootPath, $pageConfig, $defaultPriority, $defaultChangefreq);
    $sitemapPath = $rootPath . '/sitemap.xml';
    
    if (saveSitemap($sitemapContent, $sitemapPath)) {
        echo "Sitemap generated successfully at: " . $sitemapPath . "\n";
        echo "Total URLs included: " . substr_count($sitemapContent, '<url>') . "\n";
        
        // Also create a sitemap index for future expansion
        $indexContent = '<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>' . $domain . '/sitemap.xml</loc>
        <lastmod>' . date('Y-m-d') . '</lastmod>
    </sitemap>
</sitemapindex>';
        
        file_put_contents($rootPath . '/sitemap-index.xml', $indexContent);
        echo "Sitemap index created at: " . $rootPath . "/sitemap-index.xml\n";
    } else {
        echo "Error: Failed to save sitemap\n";
    }
} catch (Exception $e) {
    echo "Error generating sitemap: " . $e->getMessage() . "\n";
}

// Create a robots.txt update suggestion
$robotsContent = "User-agent: *
Allow: /

# Allow all CSS and JS files for proper rendering
Allow: /css/
Allow: /js/
Allow: /images/

# Disallow admin and private areas
Disallow: /script/email/
Disallow: /*.md$

# Sitemap locations
Sitemap: " . $domain . "/sitemap.xml
Sitemap: " . $domain . "/sitemap-index.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1
";

echo "\n--- Suggested robots.txt content ---\n";
echo $robotsContent;
echo "\n--- End of robots.txt suggestion ---\n";