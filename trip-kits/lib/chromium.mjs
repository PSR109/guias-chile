import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// gstack instala Playwright Chromium en la cache por-OS de Playwright
// (verificado 2026-07-21 en Windows):
// Windows: %LOCALAPPDATA%\ms-playwright\chromium-1228\chrome-win64\chrome.exe
// macOS:   ~/Library/Caches/ms-playwright/chromium-XXXX/chrome-mac/Chromium.app/Contents/MacOS/Chromium
// Linux:   ~/.cache/ms-playwright/chromium-XXXX/chrome-linux/chrome
const CACHE_BASE_PARTS = {
  win32: ['AppData', 'Local', 'ms-playwright'],
  darwin: ['Library', 'Caches', 'ms-playwright'],
  linux: ['.cache', 'ms-playwright'],
};
const BIN_CANDIDATES = {
  win32: [['chrome-win64', 'chrome.exe'], ['chrome-win', 'chrome.exe']],
  darwin: [['chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium']],
  linux: [['chrome-linux', 'chrome']],
};

export function chromiumPath() {
  const platform = process.platform;
  const baseParts = CACHE_BASE_PARTS[platform] ?? CACHE_BASE_PARTS.linux;
  const candidates = BIN_CANDIDATES[platform] ?? BIN_CANDIDATES.linux;
  const base = join(homedir(), ...baseParts);
  const dirs = readdirSync(base)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const d of dirs) {
    for (const sub of candidates) {
      const exe = join(base, d, ...sub);
      if (existsSync(exe)) return exe;
    }
  }
  throw new Error('Playwright Chromium no encontrado en ' + base);
}
