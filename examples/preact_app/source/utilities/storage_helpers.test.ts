import browserAPI from 'browser';
import { assertStrictEquals } from 'std/asserts';
import { assertSpyCall, assertSpyCalls, stub } from 'std/mock';

import { getStorage } from './storage_helpers.ts';

Deno.test('getStorage', async () => {
  const getStorageStub = stub(browserAPI.storage.sync, 'get', () => {
    return Promise.resolve({ storage_key: 'mock_storage_value' });
  });

  assertStrictEquals(await getStorage(), 'mock_storage_value');
  assertSpyCalls(getStorageStub, 1);

  // Expect `chrome.sync.storage.get` to be called with the storage_key
  assertSpyCall(getStorageStub, 0, { args: ['storage_key'] });
  getStorageStub.restore();
});
