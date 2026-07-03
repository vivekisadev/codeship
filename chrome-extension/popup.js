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

  const THEMES = {
    tokyoNight: { bg:'#1a1b26', chrome:'#16161e', text:'#a9b1d6', string:'#9ece6a', keyword:'#bb9af7', func:'#7aa2f7', dots:['#f7768e','#e0af68','#9ece6a'] },
    dracula: { bg:'#282a36', chrome:'#21222c', text:'#f8f8f2', string:'#f1fa8c', keyword:'#ff79c6', func:'#50fa7b', dots:['#ff5555','#f1fa8c','#50fa7b'] },
    nord: { bg:'#2e3440', chrome:'#272c36', text:'#d8dee9', string:'#a3be8c', keyword:'#81a1c1', func:'#88c0d0', dots:['#bf616a','#ebcb8b','#a3be8c'] },
    monokai: { bg:'#272822', chrome:'#1e1f1c', text:'#f8f8f2', string:'#e6db74', keyword:'#f92672', func:'#a6e22e', dots:['#f92672','#e6db74','#a6e22e'] },
    githubDark: { bg:'#0d1117', chrome:'#161b22', text:'#c9d1d9', string:'#a5d6ff', keyword:'#ff7b72', func:'#d2a8ff', dots:['#ff5f56','#ffbd2e','#27c93f'] },
    oneDark: { bg:'#282c34', chrome:'#21252b', text:'#abb2bf', string:'#98c379', keyword:'#c678dd', func:'#61afef', dots:['#e06c75','#e5c07b','#98c379'] },
    synthwave: { bg:'#241b2f', chrome:'#1a1425', text:'#f4eee4', string:'#ff8b39', keyword:'#f97e72', func:'#36f9f6', dots:['#ff5f9e','#fede5d','#36f9f6'] },
    catppuccin: { bg:'#1e1e2e', chrome:'#181825', text:'#cdd6f4', string:'#a6e3a1', keyword:'#cba6f7', func:'#89b4fa', dots:['#f38ba8','#f9e2af','#a6e3a1'] },
    gruvbox: { bg:'#282828', chrome:'#1d2021', text:'#ebdbb2', string:'#b8bb26', keyword:'#fb4934', func:'#fabd2f', dots:['#fb4934','#fabd2f','#b8bb26'] },
    solarized: { bg:'#002b36', chrome:'#00212a', text:'#93a1a1', string:'#2aa198', keyword:'#268bd2', func:'#b58900', dots:['#dc322f','#b58900','#2aa198'] },
    ayuDark: { bg:'#0b0e14', chrome:'#0d1017', text:'#bfbdb6', string:'#aad94c', keyword:'#ff8f40', func:'#ffb454', dots:['#f28779','#ffb454','#aad94c'] },
    palenight: { bg:'#292d3e', chrome:'#232635', text:'#a6accd', string:'#c3e88d', keyword:'#c792ea', func:'#82aaff', dots:['#f07178','#ffcb6b','#c3e88d'] },
    nightOwl: { bg:'#011627', chrome:'#010e1a', text:'#d6deeb', string:'#ecc48d', keyword:'#c792ea', func:'#82aaff', dots:['#ef5350','#f9c859','#addb67'] },
    rosePine: { bg:'#191724', chrome:'#14121f', text:'#e0def4', string:'#f6c177', keyword:'#c4a7e7', func:'#9ccfd8', dots:['#eb6f92','#f6c177','#9ccfd8'] },
    cobalt2: { bg:'#193549', chrome:'#122738', text:'#ffffff', string:'#3ad900', keyword:'#ffee80', func:'#ffc600', dots:['#ff628c','#ffc600','#3ad900'] },
    shadesOfPurple: { bg:'#2d2b55', chrome:'#232145', text:'#ffffff', string:'#a5ff90', keyword:'#ff9d00', func:'#fad000', dots:['#ff628c','#fad000','#a5ff90'] },
    vesper: { bg:'#101010', chrome:'#0a0a0a', text:'#ffffff', string:'#99ffe4', keyword:'#ff8080', func:'#ffc799', dots:['#ff8080','#ffc799','#99ffe4'] },
    horizon: { bg:'#1c1e26', chrome:'#16171f', text:'#cbced0', string:'#b8e248', keyword:'#ee64ae', func:'#26bbd9', dots:['#e95678','#fab795','#b8e248'] },
    panda: { bg:'#292a2b', chrome:'#1b1c1d', text:'#e6e6e6', string:'#19f9d8', keyword:'#ff75b5', func:'#45a9f9', dots:['#ff75b5','#ffb86c','#19f9d8'] },
    githubLight: { bg:'#ffffff', chrome:'#f6f8fa', text:'#24292e', string:'#032f62', keyword:'#d73a49', func:'#6f42c1', dots:['#ff5f56','#ffbd2e','#27c93f'] },
    solarizedLight: { bg:'#fdf6e3', chrome:'#eee8d5', text:'#657b83', string:'#2aa198', keyword:'#268bd2', func:'#b58900', dots:['#dc322f','#b58900','#2aa198'] },
    rosePineDawn: { bg:'#faf4ed', chrome:'#f2e9e1', text:'#575279', string:'#ea9d34', keyword:'#907aa9', func:'#286983', dots:['#b4637a','#ea9d34','#56949f'] }
  };

  function updatePreview(themeName) {
    const preview = document.getElementById('themePreview');
    if (!preview) return;
    
    if (themeName === 'random') {
      const keys = Object.keys(THEMES);
      themeName = keys[Math.floor(Math.random() * keys.length)];
    }
    
    const theme = THEMES[themeName];
    if (!theme) return;

    try {
      document.getElementById('previewHeader').style.backgroundColor = theme.chrome;
      document.getElementById('previewBody').style.backgroundColor = theme.bg;
      document.getElementById('previewBody').style.color = theme.text;
      
      const dots = document.getElementById('previewHeader').querySelectorAll('div');
      if (dots.length === 3) {
        dots[0].style.backgroundColor = theme.dots[0];
        dots[1].style.backgroundColor = theme.dots[1];
        dots[2].style.backgroundColor = theme.dots[2];
      }

      document.getElementById('previewKeyword').style.color = theme.keyword;
      document.getElementById('previewFunc').style.color = theme.func;
      document.getElementById('previewMethod').style.color = theme.func;
      document.getElementById('previewString').style.color = theme.string;
    } catch(err) {
      alert("Error updating preview: " + err.message);
    }
  }

  if (imageThemeSelect) {
    chrome.storage.local.get(['imageTheme'], (result) => {
      imageThemeSelect.value = result.imageTheme || 'random';
      updatePreview(imageThemeSelect.value);
    });
    imageThemeSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ imageTheme: e.target.value });
      updatePreview(e.target.value);
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
  
  // Debug logs button
  const logBtn = document.getElementById('logBtn');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: "GET_CONSOLE_LOGS" }, (res) => {
        if (res && res.logs) {
          navigator.clipboard.writeText(JSON.stringify(res.logs, null, 2))
            .then(() => alert("Logs copied to clipboard! Please paste them to me."))
            .catch(err => alert("Failed to copy logs: " + err));
        } else {
          alert("No logs found or background script unresponsive.");
        }
      });
    });
  }
});
