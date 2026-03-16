# Sentinel Journal

## 2024-05-26 - Sensitive Data Exposure in Websocket Debug Logs
**Vulnerability:** The `VueSocketIOLogger` class blindly logged all raw incoming socket packets directly to `window.console` when debug mode was enabled. Because WebSockets frequently transmit entire user sessions, authentication tokens, passwords, and other highly sensitive information, this effectively broadcasted confidential data directly into the client's browser console where browser extensions or XSS attacks could exfiltrate it.
**Learning:** Third-party logging utilities, especially those acting as middleware between network data (like socket.io) and application state (like Vuex), must assume all data payloads are potentially sensitive and never trust that developers will sanitize socket event arguments before they are sent from the server.
**Prevention:** Implement a recursive data sanitization method directly into the core logger class using a `WeakSet` to prevent circular dependencies. The sanitizer acts as a safety net by explicitly redacting keys matching sensitive patterns (`/password|token|secret|credential|key|auth/i`) across all log streams (`info`, `error`, `warn`, and `event`).
