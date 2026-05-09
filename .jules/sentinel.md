## 2024-05-09 - Add Data Sanitization to Logger
**Vulnerability:** The logger prints raw data to the console, potentially exposing sensitive information like passwords, tokens, or credentials if they are passed as part of event data.
**Learning:** Even development/debug logs can be captured by error reporting tools or exposed in production if debugging is left on.
**Prevention:** Implement a recursive data sanitization method in the logger that redaction sensitive keys before printing to `window.console`.
