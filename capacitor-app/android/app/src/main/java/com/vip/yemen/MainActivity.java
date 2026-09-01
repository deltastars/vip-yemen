package com.vip.yemen;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
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
 * BridgeActivity manages lifecycle. WebView configured in onCreate after super.
 */
public class MainActivity extends BridgeActivity {

    private static final String NOTIFICATION_CHANNEL_ID = "vipyemen_updates";
    private static final String NOTIFICATION_CHANNEL_NAME = "تحديثات ViP Yemen";
    private static final int MAX_RETRIES = 3;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware acceleration
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        // Status bar and nav bar colors
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.parseColor("#0A1929"));
            getWindow().setNavigationBarColor(Color.parseColor("#0A1929"));
        }

        // Notification channel
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

        // Configure WebView after BridgeActivity sets it up
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
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
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
            // WebView not ready yet, Capacitor handles it
        }
    }
}
