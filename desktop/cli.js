#!/usr/bin/env node

/**
 * OmniRTL AI - Smart Desktop Launcher & Environment Detector
 * Automatically inspects whether the user is opening desktop apps or browsers and runs the proper action.
 */

const { scanEnvironment } = require('./detector');
const { patchDesktopApp } = require('./patcher');
const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

function clear() {
  process.stdout.write('\x1Bc');
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  clear();
  console.log('======================================================');
  console.log('         🚀 OmniRTL AI - Smart Launcher v1.0.0        ');
  console.log('   Universal RTL Suite for ChatGPT, Claude & AI Apps  ');
  console.log('======================================================\n');

  console.log('🔍 Scanning system environment for AI apps & browsers...');
  const env = scanEnvironment();

  console.log('\n[1] Running Web Browsers:');
  if (env.runningBrowsers.length > 0) {
    env.runningBrowsers.forEach(b => console.log(`   🟢 Active: ${b}`));
    console.log('   👉 Tip: Use the OmniRTL Web Extension for in-browser chats.');
  } else {
    console.log('   ⚪ No active web browsers detected.');
  }

  console.log('\n[2] Detected AI Desktop Applications:');
  if (env.desktopApps.length > 0) {
    env.desktopApps.forEach((app, i) => {
      const status = app.isRunning ? '🟢 Running' : '⚪ Installed';
      console.log(`   [${i + 1}] ${app.name} (${status}) -> ${app.installPath}`);
    });
  } else {
    console.log('   ⚪ No supported desktop AI applications found.');
  }

  console.log('\n------------------------------------------------------');
  console.log('Recommended Action: ' + (env.recommendedMode === 'DESKTOP_PATCH' ? '⚡ Patch Running Desktop App' : '🌐 Open Web Extension Folder'));
  console.log('------------------------------------------------------');

  console.log('\nOptions:');
  console.log('  [1] Auto-Patch detected Desktop AI application');
  console.log('  [2] Open Web Extension folder for Chrome/Edge');
  console.log('  [3] Re-scan system processes');
  console.log('  [0] Exit');

  const choice = await prompt('\nSelect an option [1-3, 0]: ');

  if (choice === '1') {
    if (env.desktopApps.length === 0) {
      console.log('❌ No desktop apps detected to patch.');
    } else {
      const targetApp = env.desktopApps[0];
      console.log(`\n⏳ Patching ${targetApp.name}...`);
      try {
        const res = await patchDesktopApp(targetApp);
        console.log(`✅ ${res.message}`);
      } catch (err) {
        console.error(`❌ Patch failed: ${err.message}`);
      }
    }
  } else if (choice === '2') {
    const extPath = path.join(__dirname, '..', 'web-extension');
    console.log(`\n📂 Opening Web Extension path:\n${extPath}`);
    execSync(`explorer.exe "${extPath}"`);
  } else if (choice === '3') {
    return main();
  }

  console.log('\nThank you for using OmniRTL AI!');
}

main().catch(console.error);
