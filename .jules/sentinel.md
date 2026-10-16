## 2024-05-15 - Security issue

## 2024-05-15 - Unsanitized Sensitive Data in Logs
**Vulnerability:** The `VueSocketIOLogger` class was directly printing user-supplied socket event data and payloads to the browser console (`window.console`) when `debug` mode was enabled, which could inadvertently expose sensitive information like passwords, API keys, or authentication tokens.
**Learning:** Even client-side loggers intended strictly for developer tooling can leak critical PII/credentials if left on in production or if an attacker/malicious script accesses the console object. Observability data needs proactive sanitization before it reaches native logging endpoints.
**Prevention:** Always implement a sanitization layer on top of native console/logger interfaces to recursively redact common sensitive fields (e.g., `password`, `token`, `secret`) from object and array payloads before they are outputted.
