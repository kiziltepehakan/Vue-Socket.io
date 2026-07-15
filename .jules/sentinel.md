## 2023-10-25 - Sensitive Data Leakage in Logger
**Vulnerability:** Raw socket.io events and arguments are logged directly to the browser console without sanitization, potentially exposing sensitive data like tokens and passwords.
**Learning:** Browser environments can leak sensitive data via `window.console` if logging is enabled in production (or when debug mode is accidentally left on).
**Prevention:** Implement a recursive sanitization mechanism on logged arguments to redact properties matching sensitive keys before passing them to `window.console`.
