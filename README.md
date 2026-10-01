# 🚀 OmniRTL AI — Universal RTL Suite

> **Seamless RTL Typography, Font Injection & Layout Patcher for Modern AI Ecosystems**  
> Supports **Persian (فارسی)**, **Arabic (العربية)**, **Hebrew (עברית)**, and **Urdu (اردو)**.

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platforms](https://img.shields.io/badge/Platforms-Windows%20(EXE)%20%7C%20Web%20Extension%20%7C%20Android%20(APK)-indigo.svg)](#platforms)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](#)

---

## 🌟 Platforms Included

### 1. 🌐 Web Browser Extension (`web-extension/`)
* **Manifest V3 Compliant:** Compatible with Google Chrome, Microsoft Edge, Brave, and Opera.
* **Auto-Stream Observer:** Detects incoming token directions in real-time with zero layout lag.
* **Code Block & Math Isolation:** Keeps `<pre>`, `<code>`, terminals, and LaTeX formulas strictly LTR.
* **Interactive Popup:** Full dark-mode settings panel with `Alt + R` hotkey, line-height sliders, and preset fonts.

### 2. 🖥️ Windows Desktop Patcher & Smart Detector (`desktop/`)
* **Smart Environment Scanner:** Automatically detects running processes (`ChatGPT.exe`, `Claude.exe`, `Antigravity.exe`, `Cursor.exe`) and web browsers (`Chrome`, `Edge`, `Brave`).
* **Standalone Binary:** Compiles into a single portable Windows executable (`OmniRTL-Setup.exe`).
* **Core ASAR Injection:** Directly injects the embedded Vazirmatn variable font and streaming RTL observer into Electron-based AI desktop apps.

### 3. 📱 Android AI Super-Client (`android/`)
* **Multi-AI Tabbed Workspace:** Switch instantly between ChatGPT, Claude, DeepSeek, and Gemini inside a unified mobile client.
* **Automated RTL Injection:** Embeds the core typography engine into every web session automatically on Android without needing root or extensions.

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

### 🌐 For Web Extension (Chrome / Edge / Brave):
1. Download **`OmniRTL-WebExtension.zip`** from the [Releases](https://github.com/Menasin/OmniRTL-AI/releases) section and extract it.
2. Navigate to `chrome://extensions/` (or `edge://extensions/`) in your browser.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** (top-left) and select the extracted `web-extension` folder.
5. Enjoy automatic RTL text alignment on all AI platforms!

### 🖥️ For Windows Desktop:
1. Open the `desktop` folder.
2. Run `node cli.js` or launch the compiled `OmniRTL-Setup.exe`.
3. The detector will scan running apps and prompt for a 1-click patch to permanently fix your desktop AI software.

### 📱 For Android (APK & Mobile Client):
1. **Option A (Direct APK Installation):**
   * Download the latest **`OmniRTL.apk`** from [Releases](https://github.com/Menasin/OmniRTL-AI/releases).
   * Open the `.apk` file on your Android device and tap **Install** (Allow installation from unknown sources if prompted).
   * Launch **OmniRTL AI** to instantly access ChatGPT, Claude, DeepSeek, and Gemini with pre-injected RTL & Persian typography!
2. **Option B (Build from Source):**
   * Open the `android` folder in **Android Studio**.
   * Run on your physical device or emulator, or click **Build > Build APK** to generate a custom package.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
