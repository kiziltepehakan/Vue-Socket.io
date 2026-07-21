
## 2024-05-18 - Sensitive Data Leakage in Logging
**Vulnerability:** The logger in `src/logger.js` was blindly logging all data (e.g. `window.console.info(...)`, `error`, `warn`), potentially leaking sensitive data like passwords, tokens, secrets, or keys, because Vue/Vuex applications often deal with this kind of state.
**Learning:** Even client-side, developer console logs can be risky, especially in production if debug mode isn't properly disabled or if logs are captured/shipped by crash reporting tools. Furthermore, logging complex objects can crash the application or freeze the UI thread due to circular dependencies or simply the size of the objects.
**Prevention:** Implement recursive sanitization before passing arbitrary data to console logging methods. We use a pattern that strictly copies objects (handling circular references via `WeakSet`), and replaces matching keys with `[REDACTED]`.
