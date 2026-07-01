/** Opens the extension about page in a new tab. */
export function openExtensionAboutPage(): void {
  void chrome.tabs.create({ url: chrome.runtime.getURL('about/about.html') })
}
