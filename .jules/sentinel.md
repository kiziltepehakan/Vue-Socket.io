## 2024-05-15 - [Medium] Fix sensitive data exposure in console logs
**Vulnerability:** The logger class in `src/logger.js` exposed raw data to `window.console` without checking for sensitive attributes like passwords, keys, and tokens.
**Learning:** Console logs, especially in browsers, can easily be observed by external tools or extensions, leading to accidental exposure of sensitive information that traverses Vue.js state/Socket.io messages.
**Prevention:** Always implement a sanitization mechanism for all data that is outputted to logs. Recursively sanitize plain objects and arrays to redact known sensitive key names while preventing errors like infinite loops from circular references.
