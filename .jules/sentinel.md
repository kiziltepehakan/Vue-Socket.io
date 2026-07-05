## 2026-07-05 - Fix Sensitive Data Leakage in Debug Logger
**Vulnerability:** The VueSocketIOLogger class logged sensitive data (e.g., passwords, tokens) to the console without sanitization when debugging was enabled.
**Learning:** Even internal logging mechanisms can accidentally expose sensitive information in browser development tools or production debug modes if not explicitly restricted.
**Prevention:** Implement recursive sanitization (safeguarded against circular references) on all data structures passed to logging mechanisms to redact keys commonly associated with secrets before output.
