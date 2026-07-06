## 2024-07-06 - Prevent sensitive data leakage in logs
**Vulnerability:** The logger class (`VueSocketIOLogger`) indiscriminately logged provided data objects (including nested properties) to `window.console` without sanitizing for sensitive keys like passwords, tokens, or auth credentials.
**Learning:** In frontend libraries, raw data objects are frequently dumped to logs for debugging, unintentionally exposing sensitive runtime variables when `debug` mode is enabled.
**Prevention:** Implement a recursive `sanitize` function for objects/arrays that redacts keys matching sensitive patterns (e.g., `/password|token|secret|credential|key|auth/i`) while preserving the remaining debug output, handling circular references gracefully to avoid crashes.
