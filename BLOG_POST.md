# Building Codeship: How I Overcame "Impossible" Roadblocks in Manifest V3

Every developer knows the struggle: you spend hours solving a complex problem on LeetCode, you finally get that green "Accepted" screen, and then... nothing. The code just sits there. You have to manually copy it, create a file, commit it to GitHub, and maybe write a LinkedIn post if you're feeling ambitious. 

I wanted to automate this entire workflow. That’s how **Codeship** was born. 

Codeship is a Chrome Extension and Next.js platform that automatically captures your accepted LeetCode solutions, takes a beautiful snapshot of your code, commits it to GitHub, and broadcasts your milestone to LinkedIn and Twitter. 

But building this wasn't easy. Along the way, I ran into technical walls that seemed nearly impossible to climb. Here is how I solved the hardest challenges of building Codeship.

---

### Challenge 1: The "Impossible" Image Generation in Manifest V3

**The Problem:**
To make the automated LinkedIn posts engaging, I wanted the extension to generate beautiful, syntax-highlighted images of the user's code (similar to Carbon). Historically, developers used a library called `html2canvas` for this. However, Chrome recently forced all extensions to upgrade to **Manifest V3 (MV3)**. 

MV3 replaced traditional "background pages" with "Service Workers." Service Workers are great for performance, but they have one fatal flaw for my use case: **they have absolutely no access to the DOM (Document Object Model).** Because they have no DOM, they cannot render HTML or CSS. Without HTML/CSS rendering, `html2canvas` completely breaks. Generating images in the background suddenly seemed impossible.

**The Solution:**
Instead of giving up or forcing the user to keep a popup open, I utilized a cutting-edge MV3 feature: the **Offscreen API** (`chrome.offscreen`). 

Think of the Offscreen API as a highly secure, invisible browser tab that the extension can spin up in the background. When a user submits a successful LeetCode solution:
1. The Service Worker receives the raw code.
2. It spins up a temporary `offscreen.html` document (our invisible tab).
3. It passes the code into this document, which safely applies the CSS themes and syntax highlighting.
4. The offscreen document uses `html2canvas` to take a snapshot, sends the Base64 image back to the Service Worker, and instantly deletes itself.

All of this happens in milliseconds, entirely in the background, without interrupting the user's workflow. 

---

### Challenge 2: Scraping Code Without Breaking (Network Interception)

**The Problem:**
How do you know when a user successfully passes a LeetCode problem? The beginner approach is **DOM scraping**—writing code that constantly checks the webpage to see if a green "Success" text appears on the screen. 

The problem with scraping is that Modern Single Page Applications (SPAs) like LeetCode change their UI and CSS class names all the time. If LeetCode changes a single HTML `<div>` tag, the entire extension would break. It’s a maintenance nightmare.

**The Solution:**
Instead of looking at the *surface* of the website, I went underground. I engineered an interception layer that overrides the browser's native `window.fetch` and `XMLHttpRequest` functions. 

Whenever the user clicks "Submit" on LeetCode, their browser sends a GraphQL network request to LeetCode's servers. By listening directly to these network responses, Codeship can detect the exact moment a "Submission Success" payload is received. I extract the raw code and runtime statistics directly from the data stream. 

This means Codeship doesn't care what the LeetCode website looks like. LeetCode could completely redesign their entire user interface tomorrow, and Codeship would still work flawlessly because it speaks directly to the data.

---

### Challenge 3: Surviving Internet Drops (Exponential Backoff)

**The Problem:**
Imagine you solve a Hard problem on a train with spotty Wi-Fi. The extension captures your code, tries to send it to the Codeship backend server to be pushed to GitHub, but the network request fails. If the extension just throws an error and forgets about it, you lose that automated commit forever.

**The Solution:**
I built a resilient **Queue Architecture** using Chrome's local storage and the Alarms API. 

If the backend server is down or the user's internet drops, the extension catches the failure and safely saves the submission payload to `chrome.storage.local`. It then sets a timer to try again. 

But it doesn't just try again blindly. It uses a concept called **Exponential Backoff**. If the first retry fails, it waits 1 minute. If that fails, it waits 2 minutes, then 4 minutes, and so on, up to a maximum limit. This ensures that when the user reconnects to the internet, the extension doesn't overwhelm the server with hundreds of simultaneous requests. Once the connection is stable, it processes the queue sequentially, guaranteeing that absolutely no submissions are left behind.

---

### Conclusion

Building Codeship pushed me to deeply understand the limitations and workarounds of modern browser extensions. By relying on robust data interception over brittle UI scraping, and utilizing the new Offscreen API to bypass MV3 restrictions, what initially seemed like impossible roadblocks turned into the most robust features of the application. 

If you're a developer who wants to effortlessly build your GitHub portfolio while grinding LeetCode, give Codeship a try!
