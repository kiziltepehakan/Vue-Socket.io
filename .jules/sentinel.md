## 2025-02-18 - Prevent Sensitive Data Leak in Websocket Event Logs
**Vulnerability:** Front-end loggers that indiscriminately echo websocket event payloads to the console can easily leak sensitive data like passwords, tokens, or PII.
**Learning:** Even though websockets are typically secured over WSS in production, client-side logging (if accidentally left on or forcibly enabled) can expose data in browser dev tools. A robust logger should act as a last line of defense.
**Prevention:** Implement recursive data sanitization in the logger to detect and redact keys matching known sensitive patterns (e.g., 'password', 'token') before they are written to `console.log`.
