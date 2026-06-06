
## 2024-06-06 - Prevent Sensitive Data Leakage in Client-side Logs
**Vulnerability:** The logger class in `src/logger.js` previously logged raw objects (e.g., in `info`, `warn`, `error`, `event`) directly to the browser console. This could expose sensitive data like passwords, tokens, secrets, or credentials if present in the event arguments, making them visible to users or malicious scripts via the console.
**Learning:** Client-side libraries that log events and state (such as a Vue-Socket.io integration) are especially prone to leaking full state objects. Because logs can be left enabled in production, blindly logging data can create a significant data leakage vector.
**Prevention:** Implement recursive sanitization for all objects passed to logging methods, masking keys matching sensitive patterns (e.g., `password`, `token`, `secret`) and safely handling circular references, ensuring such data never hits the console output.
