## 2026-09-12 - Sensitive Data Exposure in Logs
**Vulnerability:** The logger implementation was broadcasting raw objects without filtering. If any events or data passed via `socket.io` or `vuex` contained sensitive items like tokens or passwords, they would be visible in the console in plain text.
**Learning:** Logging logic should defensively sanitize any generic objects or arrays before displaying them in environments where developers or automated systems might access them (e.g. browser console, backend logs).
**Prevention:** Implement a recursive sanitization mechanism that replaces known sensitive keys with `[REDACTED]`, while carefully avoiding circular reference freezing via `WeakSet`.
