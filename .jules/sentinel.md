## 2024-05-16 - Prevent sensitive data leakage in logs
**Vulnerability:** The logger in `src/logger.js` passes all data directly to `window.console.info`, `error`, `warn`, and `event` without sanitizing. Since the logger is used throughout the plugin (e.g., in `emitter.js` broadcasting events and Vuex mutations), any event payload containing sensitive data like tokens or passwords will be exposed in the browser's console.
**Learning:** Event payloads broadcasted over sockets and passed to Vuex often contain authentication data, which must not be logged to the console, even in debug mode.
**Prevention:** Implement a recursive data sanitization method in the logger that scrubs keys matching sensitive patterns (e.g., password, token, secret) before logging.
