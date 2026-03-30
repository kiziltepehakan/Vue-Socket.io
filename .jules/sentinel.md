## 2024-05-14 - Prevent Sensitive Data Exposure in Debug Logs
**Vulnerability:** Client-side debug logs were exposing sensitive data such as tokens, passwords, and secrets to the browser console when `debug` mode was enabled, leading to potential information leakage.
**Learning:** Even internal logging mechanisms meant for debugging can be vectors for security breaches if sensitive data is not explicitly redacted, especially in client-side libraries where logs are visible to end-users.
**Prevention:** Implement a recursive sanitization step that strips out common sensitive keys before outputting complex objects or arrays to the console.
