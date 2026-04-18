## 2024-05-18 - [Sensitive Data Leakage in Logs]
**Vulnerability:** The logger class in `src/logger.js` was passing raw objects and arrays directly to `window.console` methods, potentially leaking sensitive information (like passwords, tokens, credentials) from the frontend application state.
**Learning:** Raw application states or objects passed via socket events can often contain sensitive info. Explicitly passing them to UI loggers leaks this info.
**Prevention:** Implement a deep sanitization function before passing objects/arrays to any unencrypted console sink, replacing keys matching sensitive patterns (e.g., /password|token/i) with '[REDACTED]'. Take care to handle circular references securely.
