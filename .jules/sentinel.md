## 2024-04-09 - [Logging Sensitive Data]
**Vulnerability:** The logger in `VueSocketIOLogger` exposed sensitive data (e.g., passwords, tokens) in plaintext to the browser console when debug mode was enabled.
**Learning:** Always sanitize logged data, especially in WebSocket implementations where unpredictable user inputs or payloads containing credentials can be sent.
**Prevention:** Added a `sanitize` method in `src/logger.js` to recursively redact fields matching sensitive keywords before logging.
