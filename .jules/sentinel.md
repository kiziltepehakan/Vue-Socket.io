## 2024-04-04 - [Sensitive Data Leakage in Logger]
**Vulnerability:** The `VueSocketIOLogger` class (src/logger.js) previously logged arbitrary `data` objects directly to `window.console` methods (info, error, warn, event) without any filtering. If the app passed sensitive data (like authentication tokens or passwords) to socket events, it would be leaked into the browser console.
**Learning:** Even internal logging mechanisms can become attack vectors (information leakage) if they log arbitrary data objects directly to potentially accessible areas like the browser console.
**Prevention:** Always implement a sanitization mechanism (e.g., recursive redaction of sensitive keys like password, token, secret) before passing objects to `console.*` methods.
