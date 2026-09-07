## 2024-05-18 - Exposed sensitive data in logs
**Vulnerability:** The `VueSocketIOLogger` class in `src/logger.js` previously logged all data directly without sanitization, exposing sensitive information such as passwords, tokens, and secrets in the browser console.
**Learning:** In a frontend library that handles websocket data, data payloads could frequently contain user credentials or sensitive auth tokens which must be redacted before being output to `window.console` to avoid leaking secrets.
**Prevention:** Always implement a `sanitize` method on internal loggers that iterates through object properties and redacts known sensitive keys (e.g. `password`, `token`, `secret`, `credential`, `key`, `auth`) before calling `console.*` methods.
