'use strict';

chrome.runtime.onInstalled.addListener(openOptions);
chrome.browserAction.onClicked.addListener(openOptions);

function openOptions() {
  return;
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    // Reasonable fallback.
    window.open(chrome.runtime.getURL('views/options.html'));
  }
}

chrome.browserAction.setBadge({ text: 'loading' });