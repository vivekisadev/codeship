const API_URL = "https://codeship-bay.vercel.app/api/submissions";
const ALARM_NAME = "codeship-retry-alarm";
const MAX_RETRIES = 5;

// ---- Log Capture Logic ----
const MAX_LOGS = 50;
const backgroundLogs = [];

function captureLog(level, args) {
  try {
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    backgroundLogs.push(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`);
    if (backgroundLogs.length > MAX_LOGS) backgroundLogs.shift();
  } catch (e) {
    // Ignore stringify errors
  }
}

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
  captureLog('log', args);
  originalLog.apply(console, args);
};
console.error = function(...args) {
  captureLog('error', args);
  originalError.apply(console, args);
};
console.warn = function(...args) {
  captureLog('warn', args);
  originalWarn.apply(console, args);
};
// ----------------------------

// Keep service worker alive and process queue periodically
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    processQueue();
  }
});

async function processQueue() {
  const data = await chrome.storage.local.get(["retryQueue"]);
  let queue = data.retryQueue || [];
  
  if (queue.length === 0) {
    chrome.alarms.clear(ALARM_NAME);
    return;
  }

  console.log(`Codeship: Processing retry queue. ${queue.length} items.`);
  const now = Date.now();
  const nextQueue = [];

  for (const item of queue) {
    // Exponential backoff: base 1 min (60000ms), 2^retries
    const backoffTime = 60000 * Math.pow(2, item.retries);
    if (now - item.lastAttempt < backoffTime) {
      nextQueue.push(item); // Skip for now, wait for backoff
      continue;
    }

    try {
      item.lastAttempt = now;
      item.retries += 1;
      
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item.payload)
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("Codeship Background: Push Response from Queue Success");
    } catch (err) {
      console.error("Codeship Background: Push Failed in Queue", err);
      if (item.retries < MAX_RETRIES) {
        nextQueue.push(item);
      } else {
        console.error("Codeship: Max retries exceeded. Dropping submission.");
      }
    }
  }

  await chrome.storage.local.set({ retryQueue: nextQueue });
  if (nextQueue.length > 0) {
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1 });
  }
}

async function enqueueSubmission(payload) {
  const data = await chrome.storage.local.get(["retryQueue"]);
  const queue = data.retryQueue || [];
  
  queue.push({
    payload,
    retries: 0,
    lastAttempt: Date.now()
  });
  
  await chrome.storage.local.set({ retryQueue: queue });
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1 });
}

let creating; // A global promise to avoid concurrent creates
async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['DOM_PARSER'],
      justification: 'Generate code snapshot image with html2canvas'
    });
    await creating;
    creating = null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CONSOLE_LOGS") {
    sendResponse({ logs: backgroundLogs });
    return true;
  }

  if (message.type === "PUSH_TO_GITHUB") {
    console.log("Codeship Background: Pushing to backend API...", message.payload);
    
    // Process image generation in background async function
    (async () => {
      let base64Image = null;
      try {
        await setupOffscreenDocument('offscreen.html');
        
        const data = await chrome.storage.local.get(["imageTheme"]);
        const imageTheme = data.imageTheme || "random";
        
        const response = await chrome.runtime.sendMessage({
          target: 'offscreen',
          type: 'GENERATE_IMAGE',
          data: {
            code: message.payload.code,
            language: message.payload.language,
            title: message.payload.title,
            imageTheme: imageTheme
          }
        });
        if (response && response.success) {
          base64Image = response.dataUrl;
          console.log("Codeship Background: Generated offscreen image successfully");
        } else {
          console.error("Codeship Background: Offscreen generation failed", response?.error);
        }
      } catch (err) {
        console.error("Codeship Background: Failed to setup offscreen or generate image", err);
      }

      chrome.storage.local.get(["linkedInStyle"], (data) => {
        const finalPayload = { 
          ...message.payload, 
          linkedInStyle: data.linkedInStyle || "random" 
        };
        
        if (base64Image) {
          finalPayload.base64Image = base64Image;
        }
        
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(finalPayload)
        })
        .then(async res => {
          if (!res.ok) {
            let errMsg = `HTTP ${res.status}`;
            try {
              const errData = await res.json();
              if (errData && errData.error) {
                errMsg = errData.error;
              }
            } catch (_) {}
            throw new Error(errMsg);
          }
          return res.json();
        })
        .then(data => {
          console.log("Codeship Background: Push Response", data);
          sendResponse({ success: data.success, data: data });
        })
        .catch(err => {
          console.error("Codeship Background: Push Failed", err);
          enqueueSubmission(finalPayload);
          const errorMsg = err.toString().replace(/^Error:\s*/, "");
          sendResponse({ success: false, error: errorMsg, queued: true });
        });
      });
    })();

    return true; // Keep channel open
  }
});
