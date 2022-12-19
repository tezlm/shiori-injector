import { getBrowser, openOptions } from "./browser";
import { getConfiguration, isConfigurationComplete } from "./configuration";

import { search } from "./shiori";

const browser = getBrowser();

// Connection to search injection content script
let portFromCS;

function connected(p) {
  portFromCS = p;

  // When the content script sends the search term, search on shiori and
  // return results
  portFromCS.onMessage.addListener(function (m) {
    if (m.action == "openOptions") {
      // Open the add on options if the user clicks on the options link in the
      // injected box
      openOptions();
    } else if (isConfigurationComplete() == false) {
      portFromCS.postMessage({
        message:
          "Connection to your shiori instance is not configured yet! " +
          "Please configure the extension in the <a class='openOptions'>options</a>.",
      });
    } else {
      let config = getConfiguration();
      // Configuration is complete, execute a search on shiori
      search(m.searchTerm)
        .then((results) => {
          const bookmarkSuggestions = results
            .slice(0, config.resultNum)
            .map((bookmark) => ({
              url: bookmark.url,
              title: bookmark.title || bookmark.url,
              description: bookmark.excerpt,
              tags: bookmark.tags,
              date: bookmark.modified,
            }));
          portFromCS.postMessage({
            results: bookmarkSuggestions,
            config: config,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}

browser.runtime.onConnect.addListener(connected);
