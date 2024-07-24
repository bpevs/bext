/**
 * @module
 * Simple predicate functions for determining current browser
 */

/*
 * Enum for browser identity.
 * "DENO" signals that we are in a test environment
 */
enum BrowserType {
  DENO = 'DENO',
  CHROME = 'CHROME',
  FIREFOX = 'FIREFOX',
}

const { CHROME, DENO, FIREFOX } = BrowserType

/**
 * Which browser is this?
 * @param {string} toCheck to check
 */
function isBrowser(toCheck: BrowserType): boolean {
  let currentBrowser = CHROME
  try {
    // Use try block, since userAgent not guaranteed to exist.
    // If fail, assume Chromium
    const userAgent: string = navigator?.userAgent || ''
    if (/firefox/i.test(userAgent)) {
      currentBrowser = FIREFOX
    } else if (/deno/i.test(userAgent)) {
      currentBrowser = DENO
    }
  } catch (_) {
    // Do nothing
  }

  if (!toCheck) currentBrowser
  if (toCheck === CHROME && currentBrowser === CHROME) return true
  if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true
  if (toCheck === DENO && currentBrowser === DENO) return true
  return false
}

/**
 * @return true if running as a Chrome extension
 * @example assert(isChrome())
 */
export function isChrome(): boolean {
  return isBrowser(CHROME)
}

/**
 * @return true if running in a Deno test environment
 * @example assert(isDeno())
 */
export function isDeno(): boolean {
  return isBrowser(DENO)
}

/**
 * @return true if running as a Firefox extension
 * @example assert(isFirefox())
 */
export function isFirefox(): boolean {
  return isBrowser(FIREFOX)
}
