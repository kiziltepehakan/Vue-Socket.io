## 2024-05-18 - Prevent Sensitive Data Leakage in Logs
**Vulnerability:** Exposed sensitive data (e.g., passwords, tokens) in console logs when `debug` mode is enabled.
**Learning:** Event data from Socket.IO components could include user credentials or tokens which get dumped entirely to `window.console` if logging is unrestricted.
**Prevention:** Always implement a `sanitize` method on the logger class to recursively filter out known sensitive keys (like password, token, secret) from plain objects and arrays before passing them to console functions. Utilize `WeakSet` to avoid circular reference loops.
