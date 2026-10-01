/**
 * OmniRTL AI - Core Bi-directional Typography & Detection Engine
 * Shared between Desktop, Web Extension, and Android WebViews.
 */

// Comprehensive Unicode Blocks for RTL languages (Hebrew, Arabic, Persian, Urdu)
const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
const FIRST_STRONG_CHAR_REGEX = /[A-Za-z\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

function detectDirection(text) {
  if (!text) return null;
  const clean = text.replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
  if (!clean) return null;
  const match = clean.match(FIRST_STRONG_CHAR_REGEX);
  if (match) {
    return RTL_REGEX.test(match[0]) ? 'rtl' : 'ltr';
  }
  return RTL_REGEX.test(clean) ? 'rtl' : 'ltr';
}

const BASE_RTL_CSS = `
  /* Strict LTR for code, terminals, formulas */
  pre, code, pre *, code *, kbd, samp, var, .mono, .monospace,
  .cm-editor, .monaco-editor, .hljs, .prism, [data-testid="code-block"],
  [data-testid="terminal"], .terminal, .xterm, .katex, .math {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
  }

  [dir="rtl"] {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
  }

  [dir="ltr"] {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
  }

  /* List & indent alignment in RTL */
  [dir="rtl"] ul, [dir="rtl"] ol, ul[dir="rtl"], ol[dir="rtl"] {
    padding-left: 0 !important;
    padding-right: 1.6rem !important;
  }

  /* Quotes in RTL */
  [dir="rtl"] blockquote {
    border-left: none !important;
    border-right: 4px solid currentColor !important;
    padding-left: 0 !important;
    padding-right: 1rem !important;
  }
`;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RTL_REGEX,
    FIRST_STRONG_CHAR_REGEX,
    detectDirection,
    BASE_RTL_CSS
  };
}
