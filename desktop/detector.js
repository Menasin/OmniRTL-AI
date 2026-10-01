/**
 * OmniRTL AI - Desktop Environment & Process Detector
 * Scans Windows processes and common paths for ChatGPT, Claude, Antigravity, and active browsers.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Known process signatures
const KNOWN_TARGETS = [
  {
    id: 'antigravity',
    name: 'Antigravity IDE / AGY',
    type: 'desktop_app',
    processNames: ['Antigravity.exe', 'antigravity-ide.exe'],
    findPaths: () => {
      const paths = [
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Antigravity'),
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'antigravity'),
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'antigravity-ide'),
        'C:\\Program Files\\Antigravity',
        'C:\\Program Files (x86)\\Antigravity'
      ];
      for (const p of paths) {
        if (fs.existsSync(p)) return p;
      }
      return null;
    }
  },
  {
    id: 'chatgpt-desktop',
    name: 'ChatGPT Desktop for Windows',
    type: 'desktop_app',
    processNames: ['ChatGPT.exe'],
    findPaths: () => {
      const paths = [
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'ChatGPT'),
        path.join(os.homedir(), 'AppData', 'Local', 'ChatGPT')
      ];
      for (const p of paths) {
        if (fs.existsSync(p)) return p;
      }
      return null;
    }
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop for Windows',
    type: 'desktop_app',
    processNames: ['Claude.exe'],
    findPaths: () => {
      const paths = [
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Claude'),
        path.join(os.homedir(), 'AppData', 'Local', 'Claude')
      ];
      for (const p of paths) {
        if (fs.existsSync(p)) return p;
      }
      return null;
    }
  },
  {
    id: 'cursor',
    name: 'Cursor AI Editor',
    type: 'desktop_app',
    processNames: ['Cursor.exe'],
    findPaths: () => {
      const p = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'cursor');
      return fs.existsSync(p) ? p : null;
    }
  }
];

const BROWSERS = [
  { name: 'Google Chrome', proc: 'chrome.exe' },
  { name: 'Microsoft Edge', proc: 'msedge.exe' },
  { name: 'Brave Browser', proc: 'brave.exe' },
  { name: 'Mozilla Firefox', proc: 'firefox.exe' },
  { name: 'Opera', proc: 'opera.exe' }
];

function getRunningProcesses() {
  try {
    const stdout = execSync('tasklist /FO CSV /NH', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = stdout.split('\r\n');
    const running = new Set();
    for (const line of lines) {
      const match = line.match(/^"([^"]+)"/);
      if (match) {
        running.add(match[1].toLowerCase());
      }
    }
    return running;
  } catch (e) {
    return new Set();
  }
}

function scanEnvironment() {
  const running = getRunningProcesses();
  const detectedApps = [];
  const activeBrowsers = [];

  // 1. Detect Desktop AI Applications
  for (const target of KNOWN_TARGETS) {
    const isRunning = target.processNames.some(p => running.has(p.toLowerCase()));
    const installPath = target.findPaths();
    if (isRunning || installPath) {
      detectedApps.push({
        id: target.id,
        name: target.name,
        isRunning,
        installPath,
        type: 'desktop'
      });
    }
  }

  // 2. Detect Running Browsers (Web usage mode)
  for (const b of BROWSERS) {
    if (running.has(b.proc.toLowerCase())) {
      activeBrowsers.push(b.name);
    }
  }

  return {
    desktopApps: detectedApps,
    runningBrowsers: activeBrowsers,
    recommendedMode: detectedApps.some(a => a.isRunning) ? 'DESKTOP_PATCH' : 'WEB_EXTENSION'
  };
}

module.exports = {
  scanEnvironment,
  KNOWN_TARGETS
};
