## 2024-06-16 - Exposed Sensitive Data in Logs
**Vulnerability:** The logger simply passes log payloads (events, inputs) to window.console without sanitization, risking exposure of tokens, passwords, and API keys.
**Learning:** Console logs inside Vue plugins that receive broad objects or inputs will inadvertently expose application secrets if not sanitized.
**Prevention:** Always implement a sanitization utility for custom loggers that traverses plain objects and arrays to redact keys like 'password', 'token', 'secret', etc., handling circular references correctly.
