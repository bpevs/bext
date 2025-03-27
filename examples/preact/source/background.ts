import type Chrome from '@bpev/bext/types/chrome'
import browserAPI from '@bpev/bext'

browserAPI.tabs.onUpdated.addListener(
  (
    _tabId: number,
    _tabChangeInfo: Chrome.TabChangeInfo,
    { url }: Chrome.Tab,
  ) => {
    console.log(url)
  },
)
