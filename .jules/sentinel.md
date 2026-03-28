## 2024-05-18 - Fix Sensitive Data Exposure in Logger
**Vulnerability:** Client-side logger in `VueSocketIOLogger` was logging potentially sensitive data (like passwords or tokens) directly to the browser console without sanitization when debug mode was enabled.
**Learning:** Even internal or debug loggers can inadvertently expose sensitive application state or user credentials if they just dump whole objects to the console.
**Prevention:** Always implement data sanitization for loggers that process arbitrary application state or event payloads, targeting known sensitive keys (password, token, auth, etc.) and gracefully handling circular references and complex objects.
