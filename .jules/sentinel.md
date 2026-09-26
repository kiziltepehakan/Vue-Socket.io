## 2025-02-27 - VueSocketIOLogger Logs Sensitive Information
**Vulnerability:** VueSocketIOLogger directly passes unfiltered data to window.console logs, which can inadvertently log sensitive user tokens, passwords, and secrets during normal operation if `debug` mode is enabled.
**Learning:** A logger instance used across the library should implement data sanitization on its parameters before printing them.
**Prevention:** Implement a recursive sanitization mechanism that replaces values of keys containing terms like `password`, `token`, `secret`, etc., with `[REDACTED]`, while carefully handling objects, arrays, and avoiding circular references.
