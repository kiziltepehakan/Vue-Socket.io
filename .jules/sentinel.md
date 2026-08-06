## 2026-08-06 - Prevent Sensitive Data Leak in Logs
**Vulnerability:** The logger in `src/logger.js` was blindly echoing arbitrary object data to the console during debug mode via `window.console.info` etc.
**Learning:** In Socket.io setups, payloads often contain auth tokens or user passwords. If debug mode is turned on in production (e.g. by a developer forgetting), these secrets are leaked to the browser console.
**Prevention:** Always implement a sanitization layer on top of raw console loggers to filter out or redact keys typically associated with secrets (e.g., password, token, secret) from plain objects and arrays.
