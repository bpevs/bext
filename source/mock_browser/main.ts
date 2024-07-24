/**
 * @module
 * A mock of `globalThis.chrome` / `globalThis.browser`, to help assist with
 * unit testing.
 */

/**
 * @todo generate from @types/chrome
 * ts-auto-mock is quite heavy if not shaken
 */
const listeners = {
  addListener: () => {},
  removeListener: () => {},
  hasListener: () => {},
}

/**
 * This is a mirror of what should be available as `browserAPI`, if running in
 * a Deno environment. Expected to be used for testing.
 *
 * @example
 * import browserAPI from "jsr:@bpev/bext";
 * import { assertStrictEquals } from 'jsr:@std/assert';
 * import { assertSpyCall, assertSpyCalls, stub } from 'jsr:@std/testing/mock';
 *
 * import { getStorage } from "./storage_helpers.ts";
 *
 * Deno.test("getStorage", async () => {
 *   const getStorageStub = stub(browserAPI.storage.sync, "get", () => {
 *     return Promise.resolve({ storage_key: "mock_storage_value" });
 *   });
 *
 *   assertStrictEquals(await getStorage(), "mock_storage_value");
 *   assertSpyCalls(getStorageStub, 1);
 *
 *   // Expect `chrome.sync.storage.get` to be called with the storage_key
 *   assertSpyCall(getStorageStub, 0, { args: ["storage_key"] });
 *  getStorageStub.restore();
});

 */
export default {
  permissions: {
    contains: () => {},
    request: () => {},
  },
  runtime: {
    onMessage: listeners,
    openOptionsPage: () => {},
    lastError: {
      message: '',
    },
  },
  storage: {
    sync: {
      get: () => {},
      set: () => {},
    },
  },
  tabs: {
    onUpdated: listeners,
    query: () => {},
    sendMessage: () => {},
  },
}
