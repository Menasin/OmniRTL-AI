/**
 * AI RTL Fixer - Background Service Worker
 * Handles commands (Alt+R), installation setup, and badge state.
 */

chrome.runtime.onInstalled.addListener(async (details) => {
  // Set default settings if not already present
  const existing = await chrome.storage.sync.get('enabled');
  if (existing.enabled === undefined) {
    await chrome.storage.sync.set({
      enabled: true,
      forceRTL: false,
      fontFamily: 'VazirmatnLocal, Vazirmatn, Cairo, Assistant, system-ui, sans-serif',
      lineHeight: '1.75',
      fontSize: '15',
      fixAtSign: true,
      showIndicator: true,
      preset: 'persian'
    });
  }

  // Set initial badge
  await chrome.action.setBadgeText({ text: 'ON' });
  await chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
});

// Handle Alt+R keyboard command from manifest
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-rtl') {
    const { enabled = true } = await chrome.storage.sync.get('enabled');
    const newState = !enabled;
    await chrome.storage.sync.set({ enabled: newState });

    await chrome.action.setBadgeText({ text: newState ? 'ON' : 'OFF' });
    await chrome.action.setBadgeBackgroundColor({ color: newState ? '#4f46e5' : '#64748b' });
  }
});

// Update badge when storage changes
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'sync' && changes.enabled) {
    const isEnabled = changes.enabled.newValue;
    await chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
    await chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#4f46e5' : '#64748b' });
  }
});
