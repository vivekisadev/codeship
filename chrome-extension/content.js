// content.js is injected into LeetCode problem pages

console.log("LeetSync: Content script loaded.");

function showToast(message, type = "syncing") {
  // Remove existing toast if any
  const existing = document.getElementById("leetsync-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "leetsync-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.padding = "16px 20px";
  toast.style.background = "#282828";
  toast.style.color = "#ffffff";
  toast.style.borderRadius = "8px";
  toast.style.fontFamily = "system-ui, -apple-system, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "500";
  toast.style.zIndex = "999999";
  toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.border = "1px solid rgba(255,255,255,0.1)";
  toast.style.transition = "all 0.3s ease";
  toast.style.transform = "translateY(100px)";
  toast.style.opacity = "0";

  let iconSvg = "";
  if (type === "syncing") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffa116" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    toast.style.borderLeft = "4px solid #ffa116";
  } else if (type === "success") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    toast.style.borderLeft = "4px solid #10b981";
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    toast.style.borderLeft = "4px solid #ef4444";
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;">
      ${iconSvg}
    </div>
    <div>${message}</div>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateY(0)";
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

  if (event.data.type && event.data.type === "LEETSYNC_SUBMISSION_ACCEPTED") {
    console.log("LeetSync: Received accepted submission from page interceptor!", event.data.payload);
    
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
