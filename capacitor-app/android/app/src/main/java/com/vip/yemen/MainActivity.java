package com.vip.yemen;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

/**
 * ViP Yemen - Main Activity
 * Package: com.vip.yemen
 * Version: 1.1.0
 * 
 * Features:
 * - Auto-update support (same package for all versions)
 * - WebView configuration for modern web apps
 * - RTL support for Arabic
 */
public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView settings for optimal performance
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            
            // Enable JavaScript
            settings.setJavaScriptEnabled(true);
            
            // Enable DOM storage
            settings.setDomStorageEnabled(true);
            
            // Enable database storage
            settings.setDatabaseEnabled(true);
            
            // Cache mode for offline support
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            
            // Allow mixed content (HTTP/HTTPS)
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            
            // Enable zoom controls
            settings.setSupportZoom(true);
            settings.setBuiltInZoomControls(true);
            settings.setDisplayZoomControls(false);
            
            // Set text encoding
            settings.setDefaultTextEncodingName("UTF-8");
        }
    }
}
