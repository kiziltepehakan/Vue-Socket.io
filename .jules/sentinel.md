## Sentinel Security Journal

## 2024-05-18 - Sensitive Data Leak in Logger
**Vulnerability:** The `VueSocketIOLogger` was directly passing raw data objects to `window.console` methods (`info`, `warn`, `error`, `event`). If the application handles sensitive data such as passwords, tokens, or other credentials and logs events involving them, these secrets would be exposed in the browser console.
**Learning:** Even internal or debug loggers can leak sensitive data in production if the debug flag is inadvertently enabled, or simply in staging environments, exposing secrets to developers or users with DevTools open.
**Prevention:** Implement a recursive data sanitization method (with circular reference protection via `WeakSet`) that explicitly redacts keys matching sensitive patterns (e.g., `/password|token|secret|credential|key|auth/i`) before passing the object to standard output streams. Only parse plain objects and arrays to avoid breaking references to complex objects.
