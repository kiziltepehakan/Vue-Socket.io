## 2024-03-24 - Sensitive Data Leakage in Logs
**Vulnerability:** The logger class in `src/logger.js` passes objects and data payload directly to `window.console` methods without sanitizing or redacting sensitive information like tokens, passwords, or authentication keys.
**Learning:** In frontend libraries, objects sent via sockets often contain sensitive information. Passing them directly to `console.log` during debugging or regular usage can expose these secrets to browser extensions or when users share console output.
**Prevention:** Implement a recursive sanitization function that traverses plain objects and arrays to redact keys matching sensitive patterns (e.g., password, token, secret) before they are logged. Use a `WeakSet` to prevent infinite loops from circular references.
