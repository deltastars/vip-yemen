package com.vip.yemen;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.view.View;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Map;
import java.util.HashMap;

/**
 * ViP Yemen - Main Activity
 * Package: com.vip.yemen
 */
public class MainActivity extends BridgeActivity {

    private static final String NOTIFICATION_CHANNEL_ID = "vipyemen_updates";
    private static final String NOTIFICATION_CHANNEL_NAME = "تحديثات ViP Yemen";
    private static final int MAX_RETRIES = 3;

    private static final Map<String, String> MIME_TYPES = new HashMap<>();
    static {
        MIME_TYPES.put(".js", "text/javascript");
        MIME_TYPES.put(".mjs", "text/javascript");
        MIME_TYPES.put(".css", "text/css");
        MIME_TYPES.put(".html", "text/html");
        MIME_TYPES.put(".json", "application/json");
        MIME_TYPES.put(".svg", "image/svg+xml");
        MIME_TYPES.put(".png", "image/png");
        MIME_TYPES.put(".jpg", "image/jpeg");
        MIME_TYPES.put(".jpeg", "image/jpeg");
        MIME_TYPES.put(".webp", "image/webp");
        MIME_TYPES.put(".woff", "font/woff");
        MIME_TYPES.put(".woff2", "font/woff2");
        MIME_TYPES.put(".ttf", "font/ttf");
        MIME_TYPES.put(".xml", "application/xml");
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0A1929"));
            getWindow().setNavigationBarColor(Color.parseColor("#0A1929"));
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("إشعارات التحديثات والعروض");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }

        postConfigureWebView();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void postConfigureWebView() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView == null) return;

            WebSettings s = webView.getSettings();
            s.setJavaScriptEnabled(true);
            s.setDomStorageEnabled(true);
            s.setDatabaseEnabled(true);
            s.setAllowFileAccess(true);
            s.setAllowContentAccess(true);
            s.setCacheMode(WebSettings.LOAD_DEFAULT);
            s.setSupportZoom(false);
            s.setBuiltInZoomControls(false);
            s.setDisplayZoomControls(false);
            s.setDefaultTextEncodingName("UTF-8");
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

            webView.setWebViewClient(new WebViewClient() {
                private int retryCount = 0;

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    return false;
                }

                @Override
                public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    String url = request.getUrl().toString();
                    // Fix MIME types for ES modules - Capacitor's WebViewAssetLoader
                    // may not set correct Content-Type for .js files
                    if (url.contains("/assets/") && url.endsWith(".js")) {
                        try {
                            // Get the path after /assets/
                            String path = url.substring(url.indexOf("/assets/") + 1);
                            // Try to load from assets
                            InputStream is = getAssets().open("public/" + path);
                            byte[] data = new byte[is.available()];
                            is.read(data);
                            is.close();
                            return new WebResourceResponse(
                                "text/javascript",
                                "UTF-8",
                                new ByteArrayInputStream(data)
                            );
                        } catch (Exception e) {
                            // Fall through to default handling
                        }
                    }
                    return super.shouldInterceptRequest(view, request);
                }

                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    if (request.isForMainFrame() && retryCount < MAX_RETRIES) {
                        retryCount++;
                        view.postDelayed(() -> view.reload(), 2000L * retryCount);
                    }
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    retryCount = 0;
                }
            });

            webView.setWebChromeClient(new WebChromeClient());
        } catch (Exception ignored) {
        }
    }
}
