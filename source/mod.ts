import type { BrowserAPI } from './types/browser_api.ts';
import { isChrome } from './utilities/predicates.ts';

export * from './types/browser_api.ts';
export * from './types/manifest.ts';
export * from './utilities/predicates.ts';

const browserAPI: BrowserAPI = isChrome()
  // deno-lint-ignore no-explicit-any
  ? (globalThis as any).chrome
  : // deno-lint-ignore no-explicit-any
    (globalThis as any).browser;

export default browserAPI;
