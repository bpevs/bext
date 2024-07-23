# bext

Tools for Building [Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) with Deno. Supports Chromium and Firefox browsers.

# Examples

- [examples/preact_app](./examples/preact_app) is our canonical usage example
- Bext powers [Favioli](https://github.com/bpevs/favioli)
- [if you make an app, lmk and I can add it here!]

# Usage

Bundler:

```sh
> deno install -g --name=bext --allow-read --allow-write --allow-run --allow-env jsr:@bpev/bext/bin

> cd ./my_project

> bext # both
> bext chrome # only chrome
> bext firefox # only ff

> bext --watch # build again on change
> bext chrome -w # variations can be used for single-platform
> bext firefox --watch
```

Types and Cross-Platform API Handling:

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
import browserAPI from 'jsr:@bpev/bext'

browserAPI.tabs.onUpdated.addListener(
  (tabId: number, _: Chrome.TabChangeInfo, tab: Chrome.Tab) => {
    // do stuff
  },
)
```

# Running this repo (for Bext development)

Tasks are defined in [deno.json](./deno.json), but basically:

- `deno task dev`: Run the example app in watch-mode
- `deno task test`: Makes sure it all works. Use this before committing!
  - runs fmt, lint, type-checks, unit tests for source and example apps
  - builds example apps using local bext copy
