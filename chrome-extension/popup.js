document.addEventListener('DOMContentLoaded', () => {
  const postStyleSelect = document.getElementById('postStyle');
  const imageThemeSelect = document.getElementById('imageTheme');

  if (postStyleSelect) {
    chrome.storage.local.get(['linkedInStyle'], (result) => {
      postStyleSelect.value = result.linkedInStyle || 'random';
    });
    postStyleSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ linkedInStyle: e.target.value });
    });
  }

  if (imageThemeSelect) {
    chrome.storage.local.get(['imageTheme'], (result) => {
      imageThemeSelect.value = result.imageTheme || 'random';
    });
    imageThemeSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ imageTheme: e.target.value });
    });
  }

  // Report Issue Logic
  const toggleBtn = document.getElementById('toggleReportBtn');
  const formContainer = document.getElementById('reportFormContainer');
  const submitBtn = document.getElementById('submitReportBtn');
  const statusDiv = document.getElementById('reportStatus');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      formContainer.style.display = formContainer.style.display === 'none' ? 'flex' : 'none';
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const type = document.getElementById('reportType').value;
      const description = document.getElementById('reportDesc').value;
      
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';

      try {
        // Fetch logs from background script
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "GET_CONSOLE_LOGS" }, resolve);
        });
        
        const logs = response?.logs || [];
        
        // Timeout for fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // POST to our endpoint
        const apiRes = await fetch("https://codeship-bay.vercel.app/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            description,
            consoleLogs: logs.join('\n'),
            source: 'extension'
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (apiRes.ok) {
          statusDiv.textContent = 'Report submitted!';
          statusDiv.style.color = '#10b981';
          setTimeout(() => { formContainer.style.display = 'none'; }, 2000);
        } else {
          statusDiv.textContent = 'Failed to submit report.';
          statusDiv.style.color = '#ef4444';
        }
      } catch (e) {
        statusDiv.textContent = 'Error: ' + (e.name === 'AbortError' ? 'Request timed out' : e.message);
        statusDiv.style.color = '#ef4444';
      } finally {
        submitBtn.textContent = 'Submit with Logs';
        submitBtn.disabled = false;
        submitBtn.style.cursor = 'pointer';
      }
    });
  }
});
