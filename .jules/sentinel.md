## 2024-04-16 - Prevent sensitive data leakage in logs
**Vulnerability:** The logger class was directly passing un-sanitized data to `window.console` methods, potentially exposing sensitive information (e.g., tokens, passwords) in the browser console.
**Learning:** Even simple debugging loggers in frontend libraries need data sanitization to prevent accidental exposure of sensitive credentials that might be passed in socket events.
**Prevention:** Implement a recursive sanitization function that scrubs properties matching sensitive keywords (e.g., password, token) before logging to the console.
