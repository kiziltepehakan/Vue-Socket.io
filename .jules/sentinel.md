
## 2024-05-18 - Sensitive Data Leak in Logger
**Vulnerability:** The logger in `src/logger.js` logged entire event payloads without sanitization. If an application using this library transmits sensitive data (like passwords, tokens, API keys) via WebSockets and turns on debug mode, those credentials would be exposed in plain text in the browser's console.
**Learning:** Third-party library logging mechanisms can be unexpected sources of sensitive data leaks. When building a library that acts as a conduit for application data, the library must either enforce strict log sanitization or disable debug-level payload logging by default.
**Prevention:** Implement recursive sanitization on all logged objects and arrays that replaces keys matching common sensitive terms (e.g., `/password|token|secret|credential|key|auth/i`) with `[REDACTED]`. Ensure circular references and native objects like `Error` are handled safely to avoid freezing or destroying observability.
