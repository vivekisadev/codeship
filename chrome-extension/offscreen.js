chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'offscreen' && message.type === 'GENERATE_IMAGE') {
    handleGenerateImage(message.data).then(dataUrl => {
      sendResponse({ success: true, dataUrl });
    }).catch(err => {
      sendResponse({ success: false, error: err.toString() });
    });
    return true; // Keep channel open for async response
  }
});

async function handleGenerateImage({ code, language, title, imageTheme }) {
  // Update UI elements and trigger events so the HTML's internal state updates
  const codeInput = document.getElementById('codeInput');
  const langSelect = document.getElementById('langSelect');
  const filenameInput = document.getElementById('filenameInput');
  const randomizeBtn = document.getElementById('randomizeBtn');
  
  if (codeInput) {
    codeInput.value = code || 'console.log("Empty");';
    codeInput.dispatchEvent(new Event('input'));
  }
  
  if (langSelect) {
    langSelect.value = language || 'javascript';
    if (!langSelect.value) langSelect.value = 'plain'; // fallback
    langSelect.dispatchEvent(new Event('change'));
  }
  
  if (filenameInput) {
    // Assuming the HTML auto-sets extension if we trigger langSelect change, but just in case:
    filenameInput.value = `${title || 'solution'}`;
    filenameInput.dispatchEvent(new Event('input'));
  }

  // Set the specific theme or randomize
  if (imageTheme && imageTheme !== 'random') {
    const swatch = document.querySelector(`.theme-swatch[data-key="${imageTheme}"]`);
    if (swatch) {
      swatch.click();
    } else if (randomizeBtn) {
      randomizeBtn.click();
    }
  } else if (randomizeBtn) {
    randomizeBtn.click();
  }

  // Allow DOM to settle and fonts to render
  await new Promise(r => setTimeout(r, 500));

  // Access the renderCanvas function defined in the HTML's inline script
  if (typeof window.renderCanvas === 'function') {
    // scale 3 is recommended by the generator
    const canvas = await window.renderCanvas(3);
    return canvas.toDataURL('image/png');
  } else {
    throw new Error('renderCanvas function not found in offscreen document.');
  }
}
