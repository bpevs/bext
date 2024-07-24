/**
 * @module
 * Cross platform `browser` / `chrome` globals access, as well as basic
 * predicate functions for determining browser environment.
 */
import type BrowserAPI from './types/chrome.ts'
import { isDeno, isFirefox } from './utilities/predicates.ts'
import mockBrowser from './mock_browser/main.ts'

export * from './utilities/predicates.ts'

// deno-lint-ignore no-explicit-any
let browserAPI: BrowserAPI = (globalThis as any).chrome
export type { BrowserAPI }

if (isFirefox()) {
  // deno-lint-ignore no-explicit-any
  browserAPI = (globalThis as any).browser
}

// For running unit tests, use a mock browser structure
// TODO: tree-shake this away in browser builds
// TODO: Make this 1:1 BrowserAPI type
if (isDeno()) {
  // deno-lint-ignore no-explicit-any
  browserAPI = mockBrowser as any
}

/**
 * @default
 *
 * Cross-platform `browser` / `chrome` global. Re-exports `globalThis.browser`
 * `globalThis.chrome`, or a mock browser, depending on the environment.
 *
 * @example
 * ```ts
 * import browserAPI from "jsr:@bpev/bext"
 *
 * export function getStorage() {
 *   const data = await browserAPI.storage.sync.get("storage_key")
 *   return data[KEY]
 * }
 * ```
 */
export default browserAPI
