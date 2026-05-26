document.addEventListener('DOMContentLoaded', () => {
  const styleOptions = document.querySelectorAll('.style-option');
  
  if (styleOptions.length > 0) {
    const updateActiveStyle = (val) => {
      styleOptions.forEach(opt => {
        if (opt.getAttribute('data-value') === val) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    };

    chrome.storage.local.get(['linkedInStyle'], (result) => {
      updateActiveStyle(result.linkedInStyle || 'random');
    });

    styleOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const val = opt.getAttribute('data-value');
        updateActiveStyle(val);
        chrome.storage.local.set({ linkedInStyle: val });
      });
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

      try {
        // Fetch logs from background script
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "GET_CONSOLE_LOGS" }, resolve);
        });
        
        const logs = response?.logs || [];
        
        // POST to our endpoint
        const apiRes = await fetch("http://localhost:3000/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            description,
            consoleLogs: logs.join('\n'),
            source: 'extension'
          })
        });

        if (apiRes.ok) {
          statusDiv.textContent = 'Report submitted!';
          statusDiv.style.color = '#10b981';
          setTimeout(() => { formContainer.style.display = 'none'; }, 2000);
        } else {
          statusDiv.textContent = 'Failed to submit report.';
          statusDiv.style.color = '#ef4444';
        }
      } catch (e) {
        statusDiv.textContent = 'Error: ' + e.message;
        statusDiv.style.color = '#ef4444';
      } finally {
        submitBtn.textContent = 'Submit with Logs';
        submitBtn.disabled = false;
      }
    });
  }
});
