# bext

Tools for Building [Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) with Deno. Supports Chromium and Firefox browsers.

# Usage

You can see basic examples here: https://github.com/bpevs/bext/tree/main/examples

You can also see a real-world example by looking at [Favioli](https://github.com/bpevs/favioli).

## Bundle

Once you have an app structured, bext can bundle your extension for Chrome and Firefox using esbuild. It will also take browser-specific properties from your
`manifest.json` file, and format them into a compatible structure for each
browser.

```sh
> deno install -gA --name=bext jsr:@bpev/bext/bin

> cd ./my_project

> bext # both
> bext chrome # only chrome
> bext firefox # only ff

# Watch mode
> bext --watch # or -w: build again on change
> bext chrome -w # variations can be used for single-platform
> bext firefox --watch

# Custom directories
> bext --source=src # --source or -s: specify source directory (default: "source")
> bext --source=src --static=assets # --static or -t: specify static assets directory (default: "static")
> bext --source=src --static=assets --output=build # --output or -o: specify output directory (default: "dist")

> bext --config=../deno.json # --config or -c: specify deno.json config file. If using a workspace, point at the root workspace deno.json
```

## Types and Utilities

While building your app, bext re-exports the native extension apis, to smooth out a few of the cross-platform differences. We also add a couple utility functions to determine which browser we are using.

```ts
// Import the direct npm:@types/chrome import used to define browserAPI in Bext
// Alternatively, `import { Tab, TabChangeInfo } from npm:@types/chrome`
import type Chrome from 'jsr:@bpev/bext/types/chrome'

/**
 * browserAPI resolves to:
 *   - globalThis.chrome in Chromium browsers
 *   - globalThis.browser in Firefox browsers
 *   - Bext's mock_browser in Deno context (for unit testing)
 */
import browserAPI, { isChrome, isFirefox } from 'jsr:@bpev/bext'

browserAPI.tabs.onUpdated.addListener(
  (tabId: number, _: Chrome.TabChangeInfo, tab: Chrome.Tab) => {
    console.log(isChrome(), isFirefox())
  },
)
```

## Testing

bext `browserAPI` will also return a mock browser when running in a Deno environment (where native extension apis don't exist). This makes writing unit tests a breeze!

```ts
import browserAPI, { isDeno } from 'jsr:@bpev/bext'
import { assertStrictEquals } from 'jsr:@std/assert'
import { assertSpyCall, assertSpyCalls, stub } from 'jsr:@std/testing/mock'

import { getStorage } from './storage_helpers.ts'

Deno.test('is running in test env', () => {
  assert()
})

Deno.test('uses browser storage', async () => {
  const getStorageStub = stub(browserAPI.storage.sync, 'get', () => {
    return Promise.resolve({ storage_key: 'mock_storage_value' })
  })

  assertStrictEquals(await getStorage(), 'mock_storage_value')
  assertSpyCalls(getStorageStub, 1)

  // Expect `chrome.sync.storage.get` to be called with the storage_key
  assertSpyCall(getStorageStub, 0, { args: ['storage_key'] })
  getStorageStub.restore()
})
```
