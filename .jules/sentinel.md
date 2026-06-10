## 2024-05-24 - Fix sensitive data exposure in Vue-Socket.io logs
**Vulnerability:** The logger class in `src/logger.js` passes all payload data directly to `console.info`, `console.error`, etc. If a Socket.io event contains sensitive information (e.g., passwords, auth tokens, session keys), this data is logged in plaintext to the browser console.
**Learning:** Generic logging libraries or components in frontend frameworks can easily leak sensitive data if they don't implement basic sanitization or redaction for known sensitive keys.
**Prevention:** Implement a recursive sanitization function that scrubs properties matching common sensitive key patterns (`/password|token|secret|credential|key|auth/i`) from objects/arrays before logging them.
