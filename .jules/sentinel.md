
## 2024-11-03 - [Sensitive Data Exposure in Logs]
**Vulnerability:** Client-side logger (`src/logger.js`) in Vue-Socket.io prints unfiltered event data, including tokens, passwords, and sensitive keys directly to `window.console`.
**Learning:** Client-side debugging tools can inadvertently leak credentials into the browser console or analytics services that capture console logs if input parameters are not sanitized before logging.
**Prevention:** Implement a deep sanitization function for all objects logged, redacting known sensitive keys before passing them to the console API. Ensure proper handling of circular structures, arrays, and standard objects while preserving primitive values and instances of `Error`, `Date`, and `RegExp`.
