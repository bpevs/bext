/**
 * API for more platform-agnostic access to browser extension apis.
 * Since browers ext API is kind of shifting sands, let's not do too much
 * work to try and make 100% stable. But we can use this for the more stable
 * APIs to avoid putting (chrome || browser) everywhere
 *
 * @reference https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 * @reference https://developer.chrome.com/docs/extensions/reference
 * @reference https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/api-support
 *
 * Now uses https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/chrome
 */

export { default } from 'npm:@types/chrome';
