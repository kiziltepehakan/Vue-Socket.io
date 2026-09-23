
## 2024-05-18 - Client-Side Logging Data Leakage
**Vulnerability:** The logger class (`src/logger.js`) logs raw objects to `window.console` when debug mode is enabled. If a user connects to a socket.io event with sensitive payloads (e.g., authentication tokens or passwords), this data is written directly to the console where it could be visible to other scripts or malicious browser extensions, or inadvertently shared by users via screenshots/bug reports.
**Learning:** Client-side debug logging should be treated as untrusted output. Even in debug mode, sensitive data should not be printed raw to the browser's console.
**Prevention:** Implement recursive sanitization for all logging functions to redact fields matching common sensitive keywords (`password`, `token`, `secret`, `credential`, `key`, `auth`) before they are passed to the browser console. Carefully handle circular references and avoid destroying observability by only redacting specific plain object properties.
