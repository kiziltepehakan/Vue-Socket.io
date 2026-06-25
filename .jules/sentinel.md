## 2026-06-25 - [VueSocketIOLogger Data Redaction Fix]
**Vulnerability:** The logger in `src/logger.js` doesn't sanitize sensitive info like passwords or tokens before logging them to the console, risking data leakage in browsers or server logs.
**Learning:** `VueSocketIOLogger` processes real-time socket events which often contain authentication or sensitive user data. Passing this directly to `console.info` is insecure.
**Prevention:** Implemented a robust `sanitize` method that aggressively strips properties matching a sensitive key regex from arrays and plain objects while cleanly handling circular references and preserving built-in types to avoid destroying observability.
