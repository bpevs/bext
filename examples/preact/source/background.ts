import type Chrome from "browser/types/chrome.ts";
import browserAPI from "browser";

browserAPI.tabs.onUpdated.addListener(
  (
    _tabId: number,
    _tabChangeInfo: Chrome.TabChangeInfo,
    { url }: Chrome.Tab,
  ) => {
    console.log(url);
  },
);
