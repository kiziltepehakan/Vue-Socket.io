## 2024-05-01 - Sensitive Data Exposure via Client-Side Logger

**Vulnerability:** The `VueSocketIOLogger` class blindly dumped all arguments and data payloads directly to `window.console` (`info`, `error`, `warn`). Sensitive user data (e.g., authentication tokens, passwords) transmitted over WebSockets could be inadvertently exposed in the browser's developer console, accessible to any script running on the page (XSS risk) or visible during debugging.

**Learning:** Any logging utility that proxies or wraps standard console methods must assume it will handle raw, untrusted data. When integrating third-party libraries (like Socket.io) that handle application state and networking, the logger becomes a critical boundary where data sanitization is mandatory to prevent accidental leakage.

**Prevention:** Implement recursive data sanitization directly within the logger to intercept and mask sensitive keys (e.g., `password`, `token`, `secret`) before they are passed to the underlying console methods. Use `WeakSet` to safely handle circular references in the payloads without causing stack overflows.
