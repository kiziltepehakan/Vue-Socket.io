## 2025-03-03 - [Information Exposure Through Log Files]
**Vulnerability:** The logger class (`src/logger.js`) in `vue-socket.io-v4` exposed sensitive data because all arguments from `console.info`, `console.warn` and `console.error` were passed through unmodified.
**Learning:** Developers might accidentally pass sensitive data (like objects with `password`, `token` or `secret` fields) as additional arguments to the logger which would be logged directly to the browser console.
**Prevention:** Implement a deep sanitization function on all logged objects, specifically searching for key strings like `/password|token|secret|credential|key|auth/i` and redacting the values before the data makes it to `window.console`. Handled circular references using `WeakSet`.
