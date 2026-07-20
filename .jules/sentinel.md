## 2026-07-20 - Exposed Sensitive Data in Logs
**Vulnerability:** The logger utility (`src/logger.js`) logs all provided payload data via `window.console` without redacting sensitive information like tokens, passwords, or keys.
**Learning:** Even internal logging mechanisms for debugging purposes can unintentionally expose sensitive data if no sanitization logic is implemented when processing user data or external APIs.
**Prevention:** Implement a recursive data sanitization method in the logger that scans for and redacts sensitive keys matching a regex (e.g., `/password|token|secret|credential|key|auth/i`) while ensuring performance boundaries (handling circular references, limiting processing to plain objects).
