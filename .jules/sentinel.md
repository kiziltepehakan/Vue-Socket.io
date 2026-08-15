## 2024-08-15 - Data Leakage in Logger
**Vulnerability:** The logger in `src/logger.js` blindly logged all incoming socket events and data to the console if `debug` was enabled. This could lead to sensitive information leakage (e.g., tokens, passwords, keys) in the browser console.
**Learning:** Even internal logging mechanisms must sanitize data before outputting, especially when dealing with potentially sensitive user or authentication data over WebSockets.
**Prevention:** Implement a sanitize function that redacts known sensitive keys (`password`, `token`, `secret`, `credential`, `key`, `auth`) before logging. Use `WeakSet` to safely handle circular references without causing stack overflows.
