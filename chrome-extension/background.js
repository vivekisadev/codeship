// background.js handles requests that bypass CORS

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PUSH_TO_GITHUB") {
    console.log("LeetSync Background: Pushing to backend API...", message.payload);
    
    // We fetch from the live Vercel URL but include credentials so NextAuth sees the session cookie
    fetch("https://leetsync-bay.vercel.app/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(message.payload)
    })
    .then(res => res.json())
    .then(data => {
      console.log("LeetSync Background: Push Response", data);
      sendResponse({ success: data.success, data: data });
    })
    .catch(err => {
      console.error("LeetSync Background: Push Failed", err);
      sendResponse({ success: false, error: err.toString() });
    });

    return true; // Keep the message channel open for async response
  }
});
