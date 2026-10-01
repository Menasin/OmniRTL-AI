/**
 * AI RTL Fixer - Popup Controller
 * Manages configuration and syncs settings via chrome.storage.sync
 */

document.addEventListener('DOMContentLoaded', async () => {
  const enabledToggle = document.getElementById('enabled-toggle');
  const forceRtlToggle = document.getElementById('force-rtl-toggle');
  const fixAtToggle = document.getElementById('fix-at-toggle');
  const indicatorToggle = document.getElementById('indicator-toggle');
  const fontFamilyInput = document.getElementById('font-family-input');
  const lhSlider = document.getElementById('line-height-slider');
  const lhVal = document.getElementById('line-height-val');
  const fsSlider = document.getElementById('font-size-slider');
  const fsVal = document.getElementById('font-size-val');
  const presetBtns = document.querySelectorAll('.preset-btn');

  const PRESETS = {
    persian: 'VazirmatnLocal, Vazirmatn, IRANSans, Sahel, Shabnam, sans-serif',
    arabic: 'Cairo, Amiri, Tajawal, Almarai, Tahoma, sans-serif',
    hebrew: 'Assistant, Heebo, Rubik, "Segoe UI", sans-serif',
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  // 1. Load Stored Settings
  const data = await chrome.storage.sync.get([
    'enabled',
    'forceRTL',
    'fixAtSign',
    'showIndicator',
    'fontFamily',
    'lineHeight',
    'fontSize',
    'preset'
  ]);

  enabledToggle.checked = data.enabled !== false;
  forceRtlToggle.checked = data.forceRTL === true;
  fixAtToggle.checked = data.fixAtSign !== false;
  indicatorToggle.checked = data.showIndicator !== false;

  fontFamilyInput.value = data.fontFamily || PRESETS.persian;
  lhSlider.value = data.lineHeight || '1.75';
  lhVal.textContent = lhSlider.value;
  fsSlider.value = data.fontSize || '15';
  fsVal.textContent = `${fsSlider.value}px`;

  const activePreset = data.preset || 'persian';
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === activePreset);
  });

  // 2. Save Helpers
  async function saveSetting(key, val) {
    await chrome.storage.sync.set({ [key]: val });
  }

  // 3. Event Listeners
  enabledToggle.addEventListener('change', () => {
    saveSetting('enabled', enabledToggle.checked);
  });

  forceRtlToggle.addEventListener('change', () => {
    saveSetting('forceRTL', forceRtlToggle.checked);
  });

  fixAtToggle.addEventListener('change', () => {
    saveSetting('fixAtSign', fixAtToggle.checked);
  });

  indicatorToggle.addEventListener('change', () => {
    saveSetting('showIndicator', indicatorToggle.checked);
  });

  fontFamilyInput.addEventListener('change', () => {
    saveSetting('fontFamily', fontFamilyInput.value.trim());
  });

  lhSlider.addEventListener('input', () => {
    lhVal.textContent = lhSlider.value;
    saveSetting('lineHeight', lhSlider.value);
  });

  fsSlider.addEventListener('input', () => {
    fsVal.textContent = `${fsSlider.value}px`;
    saveSetting('fontSize', fsSlider.value);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.dataset.preset;
      const font = PRESETS[presetKey] || PRESETS.persian;
      fontFamilyInput.value = font;

      chrome.storage.sync.set({
        preset: presetKey,
        fontFamily: font
      });
    });
  });
});
