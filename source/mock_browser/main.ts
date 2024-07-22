/**
 * @todo generate from @types/chrome
 * ts-auto-mock is quite heavy if not shaken
 */
const listeners = {
  addListener: () => {},
  removeListener: () => {},
  hasListener: () => {},
}

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
