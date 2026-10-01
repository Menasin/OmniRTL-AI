# Chrome Web Store Metadata & Publishing Guide: AI RTL Fixer

This document contains all metadata, permissions justifications, and store listing copy needed for submission to the Chrome Web Store Developer Dashboard.

---

## 1. Store Listing Details

### Extension Title
`AI RTL Fixer - Auto RTL for ChatGPT & Claude`

### Short Name (for app launcher & tabs)
`AI RTL Fixer`

### Summary (132 characters max)
`Automatically format RTL text (Persian, Arabic, Hebrew) with isolated code blocks across ChatGPT, Claude, DeepSeek, and Gemini.`

### Detailed Description
```
Fix broken Right-to-Left (RTL) formatting and misaligned typography across your favorite AI assistants!

AI RTL Fixer automatically detects Persian, Arabic, Hebrew, and Urdu responses in real time, rendering them with clean typography, correct punctuation, and right-alignment—while keeping code blocks and formulas strictly left-to-right.

✨ KEY FEATURES:
• Real-Time Auto-Detection: Instantly identifies RTL languages as AI streams responses.
• Strict Code Block Isolation: Python, JavaScript, terminals, and LaTeX math formulas remain strictly LTR.
• Beautiful Persian & Arabic Typography: Powered by the clean Vazirmatn font with adjustable line height and font size.
• Multi-Platform Support: Seamlessly enhances ChatGPT, Claude, DeepSeek, Google Gemini, Perplexity AI, and Poe.
• Quick Toggle (Alt + R): Turn the extension on or off with a single keyboard shortcut.
• Persian Keyboard Mention Fix: Automatically fixes Shift+2 to type '@' for tagging and prompts.
• 100% Private & Offline: Operates entirely inside your browser. No external servers, no tracking, no data collection.

Supported Languages:
- Persian (فارسی)
- Arabic (العربية)
- Hebrew (עברית)
- Urdu (اردو)

Enjoy a natural reading and writing experience in your native language with AI RTL Fixer!
```

### Category
`Productivity` / `Workflow & Planning`

---

## 2. Permissions Justification (Required by Reviewers)

| Permission | Justification |
| :--- | :--- |
| `storage` | Required to save user preferences locally (custom font choices, line height, font size, and toggled states) across browser sessions. |
| `activeTab` | Required to detect the active tab's domain when toggling RTL via the Alt+R keyboard command. |

### Host Permissions Justification
* `*://chatgpt.com/*` & `*://chat.openai.com/*`: Required to detect and format RTL chat messages and prompt inputs on ChatGPT.
* `*://claude.ai/*`: Required to apply RTL styling and fix text direction on Claude conversations.
* `*://chat.deepseek.com/*`: Required to correct text alignment and reasoning stream direction on DeepSeek.
* `*://gemini.google.com/*`: Required to adjust message layout and input direction on Google Gemini.
* `*://*.perplexity.ai/*`: Required to align research answers and position citation tags correctly on Perplexity.
* `*://poe.com/*`: Required to adjust chat bubble direction on Poe.

---

## 3. Privacy & Data Use Disclosure

* **Single Purpose Description:**  
  "AI RTL Fixer formats text direction and typography for Right-to-Left languages across supported AI chat web applications."
* **Data Collection:**  
  Does the extension collect user data? **NO**.
  All DOM modifications and font rendering happen client-side in the user's browser. No data is stored externally, transmitted, or analyzed.
