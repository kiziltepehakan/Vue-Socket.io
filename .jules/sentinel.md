## 2024-05-19 - Sensitive Data Exposure in Logs
**Vulnerability:** The logger (`src/logger.js`) logged out raw socket events and connection data when `debug` mode was enabled, which could inadvertently expose sensitive information like passwords, tokens, or session IDs in the browser console.
**Learning:** Even when logging is disabled in production by default, developers enabling debug mode might leak sensitive application state if the logger doesn't proactively filter out sensitive fields. Socket.io payloads often contain raw user inputs and auth data.
**Prevention:** Implement recursive data sanitization in the logger that scrubs keys matching common sensitive terms (e.g., password, token, secret) with `[REDACTED]`, while carefully handling circular references.
