## 2024-05-20 - Sensitive Data Exposure in WebSocket Logs

**Vulnerability:** The `VueSocketIOLogger` class in `src/logger.js` was logging all incoming and outgoing WebSocket data and arguments to `window.console` without any filtering or sanitization when `debug` mode was enabled. Because WebSocket payloads often contain authentication tokens, session identifiers, passwords, or personal data, this practice risked leaking sensitive information directly into the browser's developer console in plaintext.

**Learning:** When building tools or adapters that intercept raw network communication (like socket.io wrappers), logging raw payloads is extremely dangerous. Debug features that output verbatim payloads must proactively sanitize the data by default. Leaving sanitization to the end-user usually results in accidental data leakage, especially when debug mode is left on in higher environments.

**Prevention:** Always implement a sanitization or redaction layer on debug logs that mask sensitive keys (e.g., `password`, `token`, `secret`, `key`, `auth`) using `'[REDACTED]'`. Ensure this mechanism can handle circular references and safely ignore objects like `Error` and `Date` so as not to destroy the basic observability of the system while maintaining a secure default.
