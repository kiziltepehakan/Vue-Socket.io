## 2024-05-24 - Sensitive Data Exposure in Logs
**Vulnerability:** The logger (`src/logger.js`) indiscriminately logs all objects, potentially exposing sensitive information like tokens, passwords, and secrets in the client-side console when debugging is enabled.
**Learning:** Even internal logging mechanisms must implement a sanitization layer, especially on the client side where console output might be accessed or observed by external parties or injected scripts.
**Prevention:** Implement recursive sanitization before passing objects to the underlying logger/console, redacting keys containing common sensitive names (e.g., password, token, secret, auth).
