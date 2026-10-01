/**
 * AI RTL Fixer - Core Engine
 * Handles bidirectional character detection, streaming response observation,
 * dynamic styling, and user configuration.
 */

(function () {
  'use strict';

  if (window.__AI_RTL_ENGINE_INITIALIZED__) return;
  window.__AI_RTL_ENGINE_INITIALIZED__ = true;

  // Unicode Ranges for RTL Scripts:
  // Hebrew: \u0590-\u05FF, \uFB1D-\uFB4F
  // Arabic, Persian, Urdu: \u0600-\u06FF, \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFC
  const RTL_CHAR_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
  const FIRST_STRONG_CHAR_REGEX = /[A-Za-z\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

  // Default User Configuration
  let currentConfig = {
    enabled: true,
    forceRTL: false,
    fontFamily: 'VazirmatnLocal, Vazirmatn, Cairo, Assistant, system-ui, sans-serif',
    lineHeight: '1.75',
    fontSize: '15',
    fixAtSign: true,
    showIndicator: true
  };

  const adapter = window.__AI_RTL_ADAPTER__ || {
    name: 'Generic',
    messageSelectors: ['.prose p', '.markdown p', 'p', 'li'],
    inputSelectors: ['textarea', '[contenteditable="true"]'],
    ignoreSelectors: 'pre, code, table'
  };

  // Dynamic Injected Style Element
  let dynamicStyleTag = null;
  let indicatorElement = null;

  function ensureStyleTag() {
    if (!dynamicStyleTag) {
      dynamicStyleTag = document.createElement('style');
      dynamicStyleTag.id = 'ai-rtl-fixer-dynamic-css';
      (document.head || document.documentElement).appendChild(dynamicStyleTag);
    }
  }

  function updateDynamicStyles() {
    ensureStyleTag();

    if (!currentConfig.enabled) {
      dynamicStyleTag.textContent = '';
      if (indicatorElement) indicatorElement.classList.add('inactive');
      return;
    }

    if (indicatorElement) indicatorElement.classList.remove('inactive');

    const fontRule = currentConfig.fontFamily
      ? `font-family: ${currentConfig.fontFamily} !important;`
      : '';
    const lhRule = currentConfig.lineHeight
      ? `line-height: ${currentConfig.lineHeight} !important;`
      : '';
    const fsRule = currentConfig.fontSize
      ? `font-size: ${currentConfig.fontSize}px !important;`
      : '';

    const forceRule = currentConfig.forceRTL
      ? `
        [dir="rtl"], .ai-rtl-detected, p, li, h1, h2, h3 {
          direction: rtl !important;
          text-align: right !important;
        }
      `
      : '';

    dynamicStyleTag.textContent = `
      [dir="rtl"],
      .ai-rtl-detected {
        ${fontRule}
        ${lhRule}
        ${fsRule}
      }

      /* Fix input direction and typography */
      [contenteditable="true"][dir="rtl"],
      textarea[dir="rtl"],
      input[type="text"][dir="rtl"] {
        ${fontRule}
        ${lhRule}
      }

      ${forceRule}
    `;
  }

  /**
   * Fast check for text direction: returns 'rtl', 'ltr', or null (neutral/empty)
   */
  function detectTextDirection(text) {
    if (!text) return null;
    const clean = text.replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
    if (!clean) return null;

    const match = clean.match(FIRST_STRONG_CHAR_REGEX);
    if (match) {
      return RTL_CHAR_REGEX.test(match[0]) ? 'rtl' : 'ltr';
    }
    return RTL_CHAR_REGEX.test(clean) ? 'rtl' : 'ltr';
  }

  /**
   * Apply direction attribute cleanly without unnecessary DOM updates
   */
  function setElementDirection(el, dir) {
    if (!el || !dir) return;
    const current = el.getAttribute('dir');
    if (current !== dir) {
      el.setAttribute('dir', dir);
      if (dir === 'rtl') {
        el.classList.add('ai-rtl-detected');
        el.classList.remove('ai-ltr-detected');
      } else {
        el.classList.add('ai-ltr-detected');
        el.classList.remove('ai-rtl-detected');
      }
    }
  }

  /**
   * Process an element to determine its text direction
   */
  function inspectAndApply(el) {
    if (!currentConfig.enabled) return;

    // Skip ignored nodes (pre, code, math, etc.)
    if (el.matches && el.matches(adapter.ignoreSelectors)) return;
    if (el.closest && el.closest(adapter.ignoreSelectors)) return;

    if (currentConfig.forceRTL) {
      setElementDirection(el, 'rtl');
      return;
    }

    const text = el.textContent || '';
    const dir = detectTextDirection(text);
    if (dir) {
      setElementDirection(el, dir);
    }
  }

  /**
   * Scan page with batched requestAnimationFrame
   */
  let isScanning = false;
  function scheduleFullScan() {
    if (isScanning || !currentConfig.enabled) return;
    isScanning = true;

    requestAnimationFrame(() => {
      // 1. Inputs & editables
      const inputQuery = adapter.inputSelectors.join(', ');
      document.querySelectorAll(inputQuery).forEach(input => {
        const val = input.tagName === 'TEXTAREA' || input.tagName === 'INPUT' ? input.value : input.textContent;
        const dir = detectTextDirection(val);
        if (dir) setElementDirection(input, dir);
      });

      // 2. Chat messages and content
      const messageQuery = adapter.messageSelectors.join(', ');
      document.querySelectorAll(messageQuery).forEach(msg => {
        inspectAndApply(msg);
      });

      isScanning = false;
    });
  }

  // Observe live streaming changes via MutationObserver
  let mutationTimeout = null;
  const observer = new MutationObserver((mutations) => {
    if (!currentConfig.enabled) return;

    let hasRelevantChanges = false;
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === 'characterData' || (m.type === 'childList' && m.addedNodes.length > 0)) {
        hasRelevantChanges = true;
        break;
      }
    }

    if (hasRelevantChanges) {
      if (mutationTimeout) cancelAnimationFrame(mutationTimeout);
      mutationTimeout = requestAnimationFrame(scheduleFullScan);
    }
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      scheduleFullScan();
    } else {
      document.addEventListener('DOMContentLoaded', startObserver, { once: true });
    }
  }

  // Keyboard shortcut listeners & Input helpers
  function setupInputListeners() {
    document.addEventListener('input', (e) => {
      const target = e.target;
      if (!target) return;
      if (target.matches(adapter.inputSelectors.join(', '))) {
        const val = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' ? target.value : target.textContent;
        const dir = detectTextDirection(val) || 'ltr';
        setElementDirection(target, dir);
      }
    }, { capture: true, passive: true });

    // Persian Keyboard: Shift + 2 gives '@' symbol
    document.addEventListener('keydown', (e) => {
      if (!currentConfig.fixAtSign || !currentConfig.enabled) return;
      if (e.code === 'Digit2' && e.shiftKey) {
        if (e.key === '٬' || e.key === '،') {
          e.preventDefault();
          document.execCommand('insertText', false, '@');
        }
      }
    }, { capture: true });

    // Alt + R hotkey listener inside active tab
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.code === 'KeyR') {
        e.preventDefault();
        toggleEnabled();
      }
    });
  }

  function toggleEnabled() {
    currentConfig.enabled = !currentConfig.enabled;
    if (chrome?.storage?.sync) {
      chrome.storage.sync.set({ enabled: currentConfig.enabled });
    }
    updateDynamicStyles();
    if (!currentConfig.enabled) {
      document.querySelectorAll('[dir="rtl"], .ai-rtl-detected').forEach(el => {
        el.removeAttribute('dir');
        el.classList.remove('ai-rtl-detected');
      });
    } else {
      scheduleFullScan();
    }
  }

  // Floating status indicator badge
  function createIndicator() {
    if (!currentConfig.showIndicator || indicatorElement || !document.body) return;

    indicatorElement = document.createElement('div');
    indicatorElement.className = 'ai-rtl-floating-indicator';
    indicatorElement.title = 'AI RTL Fixer (Click or Alt+R to toggle)';
    indicatorElement.innerHTML = `
      <span class="dot"></span>
      <span>RTL Fixer</span>
    `;

    indicatorElement.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEnabled();
    });

    document.body.appendChild(indicatorElement);
  }

  // Load configuration from chrome.storage
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get([
      'enabled',
      'forceRTL',
      'fontFamily',
      'lineHeight',
      'fontSize',
      'fixAtSign',
      'showIndicator'
    ], (stored) => {
      if (stored) {
        currentConfig = { ...currentConfig, ...stored };
      }
      updateDynamicStyles();
      scheduleFullScan();
      if (currentConfig.showIndicator) {
        if (document.body) createIndicator();
        else document.addEventListener('DOMContentLoaded', createIndicator, { once: true });
      }
    });

    // Listen to changes from popup UI
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        for (let key in changes) {
          currentConfig[key] = changes[key].newValue;
        }
        updateDynamicStyles();
        if (currentConfig.enabled) {
          scheduleFullScan();
        } else {
          document.querySelectorAll('[dir="rtl"], .ai-rtl-detected').forEach(el => {
            el.removeAttribute('dir');
            el.classList.remove('ai-rtl-detected');
          });
        }
      }
    });
  }

  // Initialization
  setupInputListeners();
  startObserver();
  updateDynamicStyles();
})();
