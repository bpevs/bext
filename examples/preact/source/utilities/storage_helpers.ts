import browserAPI from '@bpev/bext'

const { storage } = browserAPI
const KEY = 'storage_key'

interface Storage {
  storage_key: string
}

interface Update {
  storage_key?: {
    newValue?: string
    oldValue?: string
  }
}

/**
 * In practice, I'd usually just export these as a hook for simplicity.
 * Keeping it as separate utility just to demonstrate unit testing with mock.
 * Check out storage_helpers.test.ts
 */

// Add listener to update on any changes to browser-sync storage
export function addStorageListener(callback: (str: string) => void) {
  const updateStorage = (data: Update) => callback(data[KEY]?.newValue || '')
  storage.onChanged.addListener(updateStorage)
  return () => storage.onChanged.removeListener(updateStorage)
}

export function getStorage() {
  return storage.sync.get(KEY)
    .then((data: { [key: string]: string }) => data[KEY])
}

export function updateStorage(inputData: string) {
  storage.sync.set({ [KEY]: inputData })
}
