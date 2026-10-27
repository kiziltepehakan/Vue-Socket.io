
## 2025-02-14 - Prevent Sensitive Data Leakage in Logs
**Vulnerability:** The logger methods (`info`, `error`, `warn`, `event`) logged raw data objects unredacted, potentially leaking sensitive credentials, passwords, tokens, or session IDs in the console.
**Learning:** Client-side event loggers for global communication instances (like Socket.io) often receive whole data structures containing authentication or authorization details which shouldn't be exposed directly to `console.info` or `console.log`.
**Prevention:** Implemented a robust data sanitization function that recursively replaces keys matching `/password|token|secret|credential|key|auth/i` with `[REDACTED]`. It uses a `WeakSet` to prevent infinite recursion on circular objects and only deep clones/sanitizes plain objects and arrays to prevent disrupting prototype instances (e.g. `Error`, `Date`, etc.). All outbound logging methods now pass data through this sanitizer.
