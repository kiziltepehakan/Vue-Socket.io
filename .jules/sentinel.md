
## 2024-10-25 - [Sensitive Data Exposure in Logs]
**Vulnerability:** The logger class (`src/logger.js`) in this library logged arbitrary data payloads directly to `window.console` without sanitization. Since payloads often contain sensitive user information (like passwords or tokens), this exposed sensitive data to the browser console.
**Learning:** Front-end libraries that integrate with state management and WebSockets are particularly vulnerable to leaking state/payloads via debug logs, requiring a generic deep sanitization approach that handles circular references (`WeakSet`) and avoids breaking on complex objects (e.g., Dates, RegExps).
**Prevention:** Always implement deep object sanitization for user-provided payloads before logging in front-end debug utilities. Use regex matching on keys (e.g., password, token) to automatically redact sensitive values.
