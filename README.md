# 🚀 OmniRTL AI — Universal RTL Suite

> **Seamless RTL Typography, Font Injection & Layout Patcher for Modern AI Ecosystems**  
> Supports **Persian (فارسی)**, **Arabic (العربية)**, **Hebrew (עברית)**, and **Urdu (اردو)**.

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platforms](https://img.shields.io/badge/Platforms-Windows%20(EXE)%20%7C%20Web%20Extension%20%7C%20Android%20(APK)-indigo.svg)](#platforms)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](#)

---

## 🌟 Platforms Included

### 1. 🖥️ Windows Desktop Patcher & Smart Detector (`desktop/`)
* **Smart Environment Scanner:** Automatically detects running processes (`ChatGPT.exe`, `Claude.exe`, `Antigravity.exe`, `Cursor.exe`) and web browsers (`Chrome`, `Edge`, `Brave`).
* **Standalone Binary:** Compiles into a single portable Windows executable (`OmniRTL-Setup.exe`).
* **Core ASAR Injection:** Directly injects the embedded Vazirmatn variable font and streaming RTL observer into Electron-based AI desktop apps.

### 2. 🌐 Web Browser Extension (`web-extension/`)
* **Manifest V3 Compliant:** Compatible with Google Chrome, Microsoft Edge, Brave, and Opera.
* **Auto-Stream Observer:** Detects incoming token directions in real-time with zero layout lag.
* **Code Block & Math Isolation:** Keeps `<pre>`, `<code>`, terminals, and LaTeX formulas strictly LTR.
* **Interactive Popup:** Full dark-mode settings panel with `Alt + R` hotkey, line-height sliders, and preset fonts.

### 3. 📱 Android AI Super-Client (`android/`)
* **Multi-AI Tabbed Workspace:** Switch instantly between ChatGPT, Claude, DeepSeek, and Gemini inside a unified mobile client.
* **Automated RTL Injection:** Embeds the core typography engine into every web session automatically on Android.

---

## 🎯 Supported AI Services
* 🟢 **ChatGPT** (`chatgpt.com` & Windows Desktop App)
* 🟢 **Claude** (`claude.ai` & Windows Desktop App)
* 🟢 **DeepSeek** (`chat.deepseek.com`)
* 🟢 **Google Gemini** (`gemini.google.com`)
* 🟢 **Antigravity IDE / AGY**
* 🟢 **Perplexity AI** (`perplexity.ai`)
* 🟢 **Poe** (`poe.com`)

---

## 🛠️ Quick Installation Guide

### For Web Extension (Chrome / Edge / Brave):
1. Navigate to `chrome://extensions/` in your browser.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `web-extension` folder.
4. Enjoy automatic RTL text alignment on all AI platforms!

### For Windows Desktop:
1. Open the `desktop` folder.
2. Run `node cli.js` or launch the compiled `OmniRTL-Setup.exe`.
3. The detector will scan running apps and prompt for a 1-click patch.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
