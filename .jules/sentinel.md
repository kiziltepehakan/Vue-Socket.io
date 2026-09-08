## 2024-05-18 - Information Exposure through Logging
**Vulnerability:** The logger in `src/logger.js` indiscriminately logged all given objects, which could accidentally leak sensitive information like tokens or passwords directly into the browser console.
**Learning:** Even internal logging mechanisms must actively sanitize structured data arrays and objects because they operate within the context of the user's running browser, and third-party scripts could intercept console logs.
**Prevention:** Implement a recursive sanitization utility specifically tailored to remove properties keyed by common sensitive names (e.g. password, token, key, etc.) while avoiding errors like maximum call stack size exceeded (by handling circular structures).
