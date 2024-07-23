# Bext Boilerplate

A Preact-Rendered Chrome/Firefox extension built with Bext.

Uses:

- `background.ts` logs url to extension console for each new tab update
- `content_script.ts` shows a really annoying dialog on every page load
- `options.tsx` displays an updatable browser-storage string, and a router
- `popup.tsx` renders a button via Preact that deeplinks to options page

You need to download [Deno](https://deno.land/) and [bext](../../) in order to
build this app.

## Usage

| Commands                  | What they Do                               |
| ------------------------- | ------------------------------------------ |
| `deno task dev`           | build and watch for changes                |
| `deno task build`         | bundles extension                          |
| `deno task build:chrome`  | bundles extension only for chrome          |
| `deno task build:firefox` | bundles extension only for firefox         |
| `deno task test`          | run fmt, lint, check types, and unit tests |

If you have bundled using make commands, you should be able to load your
unpacked extension using a browser.

For loading unpacked extensions, see browser docs. Here are some examples:

- [Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
- [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#trying_it_out)

A few gotchas...

- In Chrome, you select the dir containing `manifest.json` (`dist` dir). In
  Firefox, you select the `manifest.json` itself
- Make sure your extension is enabled in private windows if testing in private
  windows...
