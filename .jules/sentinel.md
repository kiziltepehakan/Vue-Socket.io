## 2026-06-14 - Prevent Sensitive Data Leak in Console Logs
**Vulnerability:** Unsanitized data passed to `src/logger.js` would directly log sensitive information (e.g., passwords, tokens) to the browser console when debug mode is enabled.
**Learning:** Console logs in browser environments are often visible to end-users or extensions. Leaking sensitive data to the client-side console is a high security risk. Complex sanitization methods must carefully handle circular references and avoid destroying non-plain object data structures (e.g., Error, Date).
**Prevention:** Implement recursive redaction logic on log payloads targeting known sensitive keys (`/password|token|secret|credential|key|auth/i`) while tracking visited references using `Set` to prevent infinite loops.
