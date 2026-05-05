// inject.js runs in the page context, so it can hook into window.fetch

const originalFetch = window.fetch;
let lastSubmission = null;

window.fetch = async function (...args) {
  const url = args[0];
  const options = args[1];

  // Intercept the submission POST request
  if (typeof url === 'string' && url.includes("/submit/") && options && options.method === "POST") {
    try {
      const body = JSON.parse(options.body);
      if (body && body.typed_code) {
        lastSubmission = {
          code: body.typed_code,
          language: body.lang,
          question_id: body.question_id,
        };
        console.log("Codeship: Intercepted submission payload.", lastSubmission);
      }
    } catch (e) {
      console.error("Codeship: Error parsing submission body", e);
    }
  }

  // Perform the actual fetch
  const response = await originalFetch.apply(this, args);

  // Intercept the subsequent polling /check/ requests
  if (typeof url === 'string' && url.includes("/check/") && lastSubmission) {
    // Clone the response so we can read the JSON without consuming the stream for the real app
    const clone = response.clone();
    
    clone.json().then(data => {
      // Check if it's accepted
      if (data && data.state === "SUCCESS" && data.status_msg === "Accepted") {
        console.log("Codeship: Submission ACCEPTED!", data);
        
        // Extract the problem title from the URL slug
        const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
        const titleSlug = match ? match[1] : "unknown-problem";
        const formattedTitle = titleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        const payload = {
          title: formattedTitle,
          titleSlug: titleSlug,
          code: lastSubmission.code,
          language: lastSubmission.language,
          runtime: data.status_runtime || "N/A",
          memory: data.status_memory || "N/A",
        };

        // Send a message out of the page context back to our content script
        window.postMessage({ type: "CODESHIP_SUBMISSION_ACCEPTED", payload: payload }, "*");
        
        // Clear last submission to prevent duplicate pushes
        lastSubmission = null;
      }
    }).catch(e => {
      // Not a json response or error reading it, safely ignore
    });
  }

  return response;
};

console.log("Codeship: Fetch interceptor injected.");
