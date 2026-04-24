// content.js is injected into LeetCode problem pages

console.log("Codeship: Content script loaded.");

function showToast(message, type = "syncing") {
  // Remove existing toast if any
  const existing = document.getElementById("codeship-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "codeship-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "32px";
  toast.style.right = "32px";
  toast.style.padding = "14px 20px";
  toast.style.background = "rgba(18, 18, 18, 0.85)";
  toast.style.backdropFilter = "blur(12px)";
  toast.style.color = "#ededed";
  toast.style.borderRadius = "14px";
  toast.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "400";
  toast.style.letterSpacing = "0.02em";
  toast.style.zIndex = "999999";
  toast.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.border = "1px solid rgba(255,255,255,0.06)";
  toast.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  toast.style.transform = "translateY(100px) scale(0.95)";
  toast.style.opacity = "0";

  let iconSvg = "";
  if (type === "syncing") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ededed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 2s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
  } else if (type === "success") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  // Define animation if not exists
  if (!document.getElementById("codeship-styles")) {
    const style = document.createElement("style");
    style.id = "codeship-styles";
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;">
      ${iconSvg}
    </div>
    <div style="color: rgba(255,255,255,0.9);">${message}</div>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateY(0) scale(1)";
    toast.style.opacity = "1";
  }, 50);

  // Auto remove after 5 seconds if not syncing
  if (type !== "syncing") {
    setTimeout(() => {
      toast.style.transform = "translateY(100px)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  return toast;
}


// Inject the fetch interceptor into the page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) return;

  if (event.data.type && event.data.type === "CODESHIP_SUBMISSION_ACCEPTED") {
    console.log("Codeship: Received accepted submission from page interceptor!", event.data.payload);
    
    // Show UI
    showToast("Pushing to GitHub...", "syncing");
    
    // Forward this to the background script to bypass CORS restrictions
    chrome.runtime.sendMessage({
      type: "PUSH_TO_GITHUB",
      payload: event.data.payload
    }, (response) => {
      if (response && response.success) {
        showToast("Success: Pushed to GitHub!", "success");
      } else {
        const errMsg = response && response.error ? response.error : "Unknown error occurred";
        showToast("Failed: " + errMsg, "error");
      }
    });
  }
});
