import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// gstack instala Playwright Chromium aqui (verificado 2026-07-21):
// C:\Users\ASUS\AppData\Local\ms-playwright\chromium-1228\chrome-win64\chrome.exe
export function chromiumPath() {
  const base = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  const dirs = readdirSync(base)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const d of dirs) {
    for (const sub of ['chrome-win64', 'chrome-win']) {
      const exe = join(base, d, sub, 'chrome.exe');
      if (existsSync(exe)) return exe;
    }
  }
  throw new Error('Playwright Chromium no encontrado en ' + base);
}
