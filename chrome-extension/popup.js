document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('postStyle');
  
  if (select) {
    chrome.storage.local.get(['linkedInStyle'], (result) => {
      if (result.linkedInStyle !== undefined) {
        select.value = result.linkedInStyle;
      }
    });

    select.addEventListener('change', (e) => {
      chrome.storage.local.set({ linkedInStyle: e.target.value });
    });
  }
});
