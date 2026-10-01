package com.omnirtl.ai;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.tabs.TabLayout;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private TabLayout tabLayout;

    private static final String[] AI_URLS = {
        "https://chatgpt.com",
        "https://claude.ai",
        "https://chat.deepseek.com",
        "https://gemini.google.com"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        progressBar = findViewById(R.id.progressBar);
        tabLayout = findViewById(R.id.tabLayout);

        setupTabs();
        setupWebView();

        // Load default (ChatGPT)
        webView.loadUrl(AI_URLS[0]);
    }

    private void setupTabs() {
        tabLayout.addTab(tabLayout.newTab().setText("ChatGPT"));
        tabLayout.addTab(tabLayout.newTab().setText("Claude"));
        tabLayout.addTab(tabLayout.newTab().setText("DeepSeek"));
        tabLayout.addTab(tabLayout.newTab().setText("Gemini"));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                int pos = tab.getPosition();
                if (pos >= 0 && pos < AI_URLS.length) {
                    webView.loadUrl(AI_URLS[pos]);
                }
            }
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            @Override
            public void onTabReselected(TabLayout.Tab tab) {
                int pos = tab.getPosition();
                if (pos >= 0 && pos < AI_URLS.length) {
                    webView.loadUrl(AI_URLS[pos]);
                }
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString("Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                injectRtlFixer(view);
            }
        });
    }

    private void injectRtlFixer(WebView view) {
        String styles = loadAssetText("styles.css");
        String adapters = loadAssetText("adapters.js");
        String engine = loadAssetText("engine.js");

        String injection = "javascript:(function() {" +
            "if (window.__omnirtl_android_injected) return;" +
            "window.__omnirtl_android_injected = true;" +
            "var style = document.createElement('style');" +
            "style.innerHTML = `" + styles.replace("`", "\\`") + "`;" +
            "document.head.appendChild(style);" +
            adapters + "\n" +
            engine + "\n" +
            "})()";

        view.evaluateJavascript(injection, null);
    }

    private String loadAssetText(String fileName) {
        try {
            InputStream is = getAssets().open(fileName);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            return new String(buffer, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
