package com.vip.yemen;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;

/**
 * ViP Yemen - Main Activity
 * Package: com.vip.yemen
 * 
 * Features:
 * - Auto-update support (PWA-based, same package for all versions)
 * - WebView configuration for modern web apps
 * - RTL support for Arabic
 * - Performance optimization
 * - Error recovery and retry logic
 */
public class MainActivity extends BridgeActivity {
    
    private static final String PRODUCTION_URL = "https://vip-yemen-140.vercel.app";
    private int retryCount = 0;
    private static final int MAX_RETRIES = 3;
    
    @SuppressLint("SetJavaScriptEnabled")
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
            
            // Cache mode: always try network first, use cache as fallback
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            
            // Allow mixed content (HTTP/HTTPS)
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            
            // Disable zoom controls completely
            settings.setSupportZoom(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            
            // Set text encoding
            settings.setDefaultTextEncodingName("UTF-8");
            
            // Performance optimizations
            settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
            settings.setBlockNetworkImage(false);
            settings.setLoadsImagesAutomatically(true);
            settings.setSupportMultipleWindows(false);
            settings.setAllowContentAccess(true);
            settings.setGeolocationEnabled(false);
            
            // Set up error handling and auto-retry
            webView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    // Let the WebView handle all URLs within the app
                    return false;
                }
                
                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    // Retry on main frame errors
                    if (request.isForMainFrame() && retryCount < MAX_RETRIES) {
                        retryCount++;
                        view.postDelayed(() -> view.reload(), 2000 * retryCount);
                    }
                }
                
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    retryCount = 0; // Reset retry count on successful load
                }
            });
            
            // Set up Chrome client for JavaScript dialogs
            webView.setWebChromeClient(new WebChromeClient());
            
            // Clear cache periodically to ensure fresh content
            webView.clearCache(false);
        }
    }
}
