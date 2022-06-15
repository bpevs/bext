const DENO = 'DENO'; // for test env
const CHROME = 'CHROME';
const FIREFOX = 'FIREFOX';
type BrowserType = 'DENO' | 'CHROME' | 'FIREFOX';

/**
 * What browser is this?
 * @param {string} toCheck to check
 */
export function isBrowser(toCheck: BrowserType): boolean {
  let currentBrowser = CHROME;
  try {
    // Use try block, since userAgent not guaranteed to exist.
    // If fail, assume Chromium
    const userAgent: string = navigator?.userAgent || '';
    if (/firefox/i.test(userAgent)) {
      currentBrowser = FIREFOX;
    } else if (/deno/i.test(userAgent)) {
      currentBrowser = DENO;
    }
  } catch (_) {
    // Do nothing
  }

  if (!toCheck) currentBrowser;
  if (toCheck === CHROME && currentBrowser === CHROME) return true;
  if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true;
  if (toCheck === DENO && currentBrowser === DENO) return true;
  return false;
}

export function isChrome(): boolean {
  return isBrowser(CHROME);
}

export function isDeno(): boolean {
  return isBrowser(DENO);
}

export function isFirefox(): boolean {
  return isBrowser(FIREFOX);
}
