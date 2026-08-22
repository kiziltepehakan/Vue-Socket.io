## 2024-05-18 - Sensitive Data Exposure in Logs
**Vulnerability:** Browser console logs were exposing sensitive data from Socket.io event payloads via `console.info`, `console.error`, etc.
**Learning:** Third-party plugins dealing with event payloads should assume the payload contains sensitive information, rather than logging raw objects to the console, to prevent data leak in debug mode.
**Prevention:** Implement recursive redaction logic to sanitize sensitive fields (like passwords, keys, credentials) before outputting debugging logs.
