# bext

Tools for Building [Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) with Deno

**NOTE: this is currently just tools that I am consolidating from building
[Favioli](https://github.com/bpevs/favioli). I will formalize this into a more
proper library/CLI later. API will likely change drastically.**

NOTE 2: This will really mostly focus on Chromium and Firefox. Safari could be a target in the future, but Apple is just too much of a pain in the ass to
develop/release browser extensions for, currently...

# Examples

- [Example Projects](https://github.com/bpevs/bext_examples)
- [Favioli](https://github.com/bpevs/favioli) is built using bext

# Usage

Bundler:

```sh
> deno install --name=bext --allow-read --allow-write --allow-run --allow-env https://deno.land/x/bext/main.ts

> cd ./my-project

> bext # both
> bext chrome # only chrome
> bext firefox # only ff
```

Types:

```ts
import type { BrowserAPI } from 'https://deno.land/x/bext/mod.ts';

// globalThis.chrome in chrome, globalThis.browser in firefox
import browserAPI from 'https://deno.land/x/bext/mod.ts';

const { Tab, TabChangeInfo } = BrowserAPI;

browserAPI.tabs.onUpdated.addListener(
  (tabId: number, _: TabChangeInfo, tab: Tab) => {
    // do stuff
  },
);
```
