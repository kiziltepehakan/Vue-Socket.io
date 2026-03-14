## 2024-05-09 - Prevent Sensitive Data Leakage in Logs
**Vulnerability:** The logger class in `src/logger.js` exposed raw, potentially sensitive user and application data (like tokens and passwords) directly into the browser console logs, particularly via socket payloads.
**Learning:** Broadly logging raw objects in client-side code without sanitization creates significant data exposure risks, especially with objects carrying state payloads across WebSocket connections.
**Prevention:** Implement recursive object sanitization for all logging paths (`info`, `error`, `warn`, `event`). Target common sensitive field names (`/password|token|secret|credential|key|auth/i`) and handle circular references gracefully (using `WeakSet`) to prevent logging crashes.
