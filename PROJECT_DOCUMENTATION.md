# Codeship 🚀

## Overview
Codeship (formerly LeetSync) is a full-stack developer tool designed to bridge the gap between solving coding challenges and building a professional portfolio. It automatically captures accepted LeetCode solutions and seamlessly syncs them to a connected GitHub repository. 

Beyond basic syncing, Codeship offers automated social broadcasting (LinkedIn and Twitter) to help developers share their milestones, attaching dynamically generated, highly-customizable code snapshots.

## 🏗 Architecture & Code Structure

This project is built as a unified repository containing both the central Web Application (Dashboard/Backend) and the Chrome Extension client.

### 1. Web Application (`src/`)
Built with **Next.js (App Router)** and **TypeScript**, prioritizing modern React patterns and server-side rendering.
- **`src/app/`**: Contains the core routing logic.
  - **`api/`**: Backend endpoints handling OAuth callbacks, GitHub REST API interactions, and the primary webhook that receives submissions from the extension.
  - **`dashboard/` & `settings/`**: Protected routes where users manage their social connections, repository targets, and view their history.
- **`src/components/`**: Reusable UI components. Leverages **Framer Motion** for fluid animations and **Lucide React** for iconography.
- **Database (Prisma & PostgreSQL)**: Uses Prisma ORM to interact with a PostgreSQL database (hosted via Supabase). The `schema.prisma` file defines relations for `User`, `Account` (OAuth tokens), `Submission` history, and `Report`s.
- **Authentication**: Managed via **NextAuth.js**, which securely handles OAuth flows to acquire GitHub Personal Access Tokens (PATs) and social media publishing tokens.

### 2. Chrome Extension (`chrome-extension/`)
Built using **Manifest V3 (MV3)** compliance standards.
- **`content.js` & `inject.js`**: Injected directly into the LeetCode tab. They monitor the DOM and intercept XHR/GraphQL network requests to detect successful code submissions in real-time.
- **`background.js` (Service Worker)**: The central orchestrator. It manages the data pipeline between the browser and the Next.js backend. It features an exponential backoff retry queue to ensure no submissions are lost if the user loses internet connection or the server is down.
- **`offscreen.html` & `offscreen.js`**: Uses the MV3 `chrome.offscreen` API. Since Service Workers lack DOM access, this hidden document is spawned in the background to render the code with syntax highlighting and take a snapshot using `html2canvas` before uploading.
- **`popup.html` & `popup.js`**: The user interface of the extension, allowing users to configure their image theme and LinkedIn post writing style on the fly.

### 3. Root Configuration & Tooling
The project root contains essential configuration files that govern the build process, environment, and development tooling:
- **`package.json` & `package-lock.json`**: Defines all project dependencies (e.g., Next.js, Prisma, NextAuth, Framer Motion) and custom scripts (e.g., `npm run dev`, `prisma generate`).
- **`tsconfig.json` & `next-env.d.ts`**: Configures strict TypeScript rules across the monorepo to ensure type safety, and defines Next.js specific type declarations.
- **`next.config.ts`**: The core configuration for the Next.js build, handling server environments, image domains, and compilation settings.
- **`eslint.config.mjs`**: Enforces strict code quality and linting standards using ESLint.
- **`prisma/` & `prisma.config.ts`**: Contains the Prisma schema (`schema.prisma`) which serves as the single source of truth for the database architecture and generated TypeScript types.
- **`.env` & `.env.local`**: Stores critical environment variables such as the `DATABASE_URL`, NextAuth secrets, GitHub OAuth IDs, and Twitter API keys (these are never committed to version control).
- **Testing Scripts (`test-db.js`, `test_social.js`)**: Standalone Node.js scripts used to quickly verify database connectivity and social media API integrations during development.

## 🛠 Tech Stack
- **Frontend Framework**: Next.js 14+, React 19
- **Styling & Animation**: CSS Modules, Framer Motion
- **Backend**: Next.js API Routes (Serverless)
- **Database & ORM**: PostgreSQL, Prisma Client
- **Authentication**: NextAuth.js
- **Extension APIs**: Chrome Extensions Manifest V3
- **Integrations**: GitHub REST API, Twitter API v2, html2canvas

---

## 🎯 Talking Points for Recruiters

When discussing this project in interviews, here are the key technical challenges and architectural decisions you can highlight:

### 1. "How do you capture the code from LeetCode efficiently without breaking when their UI updates?"
**Answer:** Most basic extensions use DOM polling or parsing to scrape text from the screen, which is notoriously brittle because single-page applications (SPAs) frequently change class names and element structures. Instead, I engineered an interception layer using an injected script (`inject.js`). This script overrides the native `window.fetch` and `XMLHttpRequest` objects in the browser to passively listen for LeetCode's GraphQL mutation responses. When a "Submission Success" payload is detected on the network level, my script extracts the exact raw code and runtime stats securely and reliably, entirely independent of the UI state.

### 2. "Generating images in a Chrome Extension is notoriously difficult in Manifest V3. How did you solve this?"
**Answer:** With the deprecation of Manifest V2, Chrome removed the ability for background scripts (now Service Workers) to access the DOM, which completely broke libraries like `html2canvas` that require a DOM to render images. To solve this, I leveraged the new MV3 `chrome.offscreen` API. When a submission is captured, the Service Worker spins up a hidden, isolated HTML document (`offscreen.html`). It passes the raw code to this document, which renders it beautifully with custom syntax highlighting and themes, captures the image buffer, returns the Base64 image back to the Service Worker, and seamlessly cleans itself up. All of this happens instantly without interrupting the user's active tab.

### 3. "What happens if a user's internet drops or your backend server is temporarily down?"
**Answer:** Reliability was a primary focus. The extension's `background.js` implements a resilient Queue architecture with **Exponential Backoff**. If the `fetch` request to the Next.js API fails (due to network drops or 5xx server errors), the submission payload is serialized and saved to `chrome.storage.local`. A Chrome Alarm is then scheduled to retry the upload. The retry delay exponentially increases (1 minute, 2 minutes, 4 minutes, up to a maximum threshold) to ensure we don't bombard the server during an outage. Once the connection is restored, the queue is processed sequentially, guaranteeing no lost submissions.

### 4. "How is user authentication and GitHub API access managed securely?"
**Answer:** Security was paramount, so I ensured the extension itself never handles or stores sensitive tokens directly. The web dashboard utilizes **NextAuth.js** with a Prisma adapter to handle the OAuth flow securely on the server-side. Once the user connects their GitHub, their encrypted OAuth tokens are stored in the PostgreSQL database. The Chrome Extension simply uses the secure HTTP-only session cookies established between the browser and the web app to authenticate its webhook requests. The Next.js backend then handles the actual interaction with the GitHub REST API using the securely stored tokens, keeping the entire flow isolated from potential client-side vulnerabilities.

### 5. "Why did you choose Prisma and PostgreSQL over a NoSQL database for this project?"
**Answer:** While NoSQL is great for unstructured data, Codeship revolves around highly relational data: Users have multiple OAuth Accounts (GitHub, LinkedIn, Twitter), which tie into Application Settings, which relate to their history of Submissions and issue Reports. Using PostgreSQL with Prisma gave me absolute type safety across the entire stack. Prisma automatically generates TypeScript types based on my database schema, which eliminated entire categories of runtime errors during development and ensures that queries connecting a User's session to their GitHub token are strictly typed and optimized.

### 6. "How did you handle cross-origin resource sharing (CORS) between the extension and the Next.js backend?"
**Answer:** Chrome Extensions face strict CORS policies when communicating with external APIs. To resolve this, I configured the Next.js API routes to explicitly allow requests originating from the extension's unique `chrome-extension://` origin. Additionally, I defined the Next.js backend URL within the `host_permissions` in the extension's `manifest.json`. This combination ensures secure, authenticated cross-origin communication while rejecting unauthorized third-party requests to the backend endpoints.

### 7. "How do you manage state and UI updates in the Chrome Extension popup?"
**Answer:** Because the popup is transient (it destroys its state every time it's closed), I relied on `chrome.storage.local` as the single source of truth. When the popup opens, it reads the stored user preferences (like their preferred Image Theme or LinkedIn Post Style) and hydrates the DOM asynchronously. When a user changes a setting, the event listener simultaneously updates the UI and persists the new value to local storage. This creates a seamless experience without needing a heavy state management library.
