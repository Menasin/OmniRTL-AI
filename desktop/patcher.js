/**
 * OmniRTL AI - Desktop App Patcher Engine (Robust Multi-App Edition)
 * Safely hooks into Antigravity, ChatGPT Desktop, and Claude Desktop with precise context isolation.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const asar = require('@electron/asar');

function generateClientCode(fontBase64) {
  return `
    (function() {
      if (window.__omnirtl_injected) return;
      window.__omnirtl_injected = true;

      const fontData = '${fontBase64}';
      const style = document.createElement('style');
      style.id = 'omnirtl-desktop-style';
      const fontFace = fontData ? \`
        @font-face {
          font-family: 'VazirmatnEmbedded';
          src: url('data:font/woff2;base64,\${fontData}') format('woff2');
          font-weight: 100 900;
          unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
        }
      \` : '';

      style.textContent = \`
        \${fontFace}
        :root, body, p, li, h1, h2, h3, [role="article"] {
          font-family: 'VazirmatnEmbedded', system-ui, sans-serif !important;
        }
        [dir="rtl"] { direction: rtl !important; text-align: right !important; unicode-bidi: isolate !important; }
        [dir="ltr"] { direction: ltr !important; text-align: left !important; unicode-bidi: isolate !important; }
        pre, code, pre *, code *, .monaco-editor, .monospace {
          direction: ltr !important; text-align: left !important; unicode-bidi: isolate !important;
        }
      \`;
      (document.head || document.documentElement).appendChild(style);

      const RTL_REGEX = /[\\u0590-\\u05FF\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB1D-\\uFDFF\\uFE70-\\uFEFC]/;
      const FIRST_STRONG = /[A-Za-z\\u0590-\\u05FF\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB1D-\\uFDFF\\uFE70-\\uFEFC]/;

      function scan() {
        document.querySelectorAll('p, li, [contenteditable="true"], textarea, input[type="text"]').forEach(el => {
          if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.closest('pre, code')) return;
          const val = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' ? el.value : el.textContent;
          const clean = (val || '').trim();
          const m = clean.match(FIRST_STRONG);
          if (m) {
            const dir = RTL_REGEX.test(m[0]) ? 'rtl' : 'ltr';
            if (el.getAttribute('dir') !== dir) el.setAttribute('dir', dir);
          }
        });
      }

      document.addEventListener('input', scan, { capture: true });
      const obs = new MutationObserver(scan);
      obs.observe(document.body, { childList: true, subtree: true });
      scan();
    })();
  `;
}

function generatePatchBlock() {
  const fontPath = path.join(__dirname, '..', 'core', 'fonts', 'Vazirmatn-Variable.woff2');
  let fontBase64 = '';
  if (fs.existsSync(fontPath)) {
    try {
      fontBase64 = fs.readFileSync(fontPath).toString('base64');
    } catch (e) {}
  }

  const clientCode = generateClientCode(fontBase64).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `
    /* === OmniRTL AI Unified Injector === */
    try {
      if (typeof win !== 'undefined' && win && win.webContents) {
        win.webContents.on('dom-ready', () => {
          try {
            win.webContents.executeJavaScript(\`${clientCode}\`);
          } catch (e) {}
        });
      }
    } catch (err) {}
    /* === End OmniRTL AI === */
  `;
}

async function patchDesktopApp(appInfo) {
  if (!appInfo || !appInfo.installPath) {
    throw new Error('Valid application install path is required.');
  }

  const asarPath = path.join(appInfo.installPath, 'resources', 'app.asar');
  if (!fs.existsSync(asarPath)) {
    throw new Error(`Target app.asar not found at: ${asarPath}`);
  }

  // Backup original safely
  const backupPath = `${asarPath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(asarPath, backupPath);
  }

  const tempDir = path.join(os.tmpdir(), `omnirtl-${Date.now()}`);
  asar.extractAll(asarPath, tempDir);

  const utilsPath = path.join(tempDir, 'dist', 'utils.js');
  if (!fs.existsSync(utilsPath)) {
    throw new Error('dist/utils.js not found in target application ASAR.');
  }

  let code = fs.readFileSync(utilsPath, 'utf8');

  // Clean old patches if present
  if (code.includes('/* === OmniRTL AI Unified Injector === */')) {
    code = code.replace(/\/\* === OmniRTL AI Unified Injector === \*\/[\s\S]*?\/\* === End OmniRTL AI === \*\//g, '');
  }

  const patchBlock = generatePatchBlock();
  const anchor = 'void win.loadURL(url);';

  if (code.includes(anchor)) {
    code = code.replace(anchor, `${patchBlock}\n    ${anchor}`);
  } else {
    throw new Error('Could not find window creation anchor (void win.loadURL) in target application.');
  }

  fs.writeFileSync(utilsPath, code, 'utf8');

  // Repack with exact unpack options for chrome-devtools-mcp
  const packedAsar = path.join(os.tmpdir(), `omnirtl-pack-${Date.now()}.asar`);
  await asar.createPackageWithOptions(tempDir, packedAsar, {
    unpack: '**/node_modules/chrome-devtools-mcp/**'
  });

  fs.copyFileSync(packedAsar, asarPath);

  // Clean temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(packedAsar, { force: true });
  } catch (e) {}

  return { success: true, message: `Successfully patched ${appInfo.name} with OmniRTL AI!` };
}

module.exports = {
  patchDesktopApp
};
