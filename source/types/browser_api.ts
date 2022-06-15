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
 * @todo Borrows heavily from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/chrome
 */

import type { PermissionsModule } from './browser_api_modules/permissions.ts';
import type { RuntimeModule } from './browser_api_modules/runtime.ts';
import type { StorageModule } from './browser_api_modules/storage.ts';
import type { TabsModule } from './browser_api_modules/tabs.ts';
export * from './browser_api_modules/tabs.ts';

export interface BrowserAPI {
  permissions: PermissionsModule;
  runtime: RuntimeModule;
  storage: StorageModule;
  tabs: TabsModule;
}
