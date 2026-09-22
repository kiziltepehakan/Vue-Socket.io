## 2024-05-24 - Sensitive Data Leakage in Logs
**Vulnerability:** The logger in `src/logger.js` prints arguments to `window.console` without any sanitization. If sensitive data like passwords, tokens, or credentials are included in the events, they will be exposed in the browser's console, risking data leakage.
**Learning:** Even simple logging utilities need to consider data sanitization because event payloads from WebSockets can be complex objects containing sensitive user data.
**Prevention:** Implement a recursive sanitization utility in the logger to mask sensitive keys before passing data to `window.console`.
