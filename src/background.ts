chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rephraseText",
    title: "Rephrase selected text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === "rephraseText" &&
    info.selectionText &&
    tab?.id &&
    tab.url &&
    !tab.url.startsWith("chrome://")
  ) {
    chrome.windows.create({
      url: chrome.runtime.getURL(`index.html?text=${encodeURIComponent(info.selectionText)}`),
      type: "panel",
      width: 500,   // popup width
      height: 600,  // popup height
      focused: true,
    });
  }
});
