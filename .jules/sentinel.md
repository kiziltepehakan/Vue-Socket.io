## 2024-05-18 - Sensitive Data Exposure in Logs
**Vulnerability:** The logger printed arguments directly to the browser console (`window.console`) without filtering, exposing potentially sensitive data like passwords, tokens, or credentials if included in the logged objects.
**Learning:** Even internal logging mechanisms can unintentionally leak sensitive data. Proper sanitization must recursively check for sensitive keys while safely handling recursive or circular objects.
**Prevention:** Implemented a `sanitize` method on the logger using a `WeakSet` to handle `[Circular]` references while redacting fields matching `/password|token|secret|credential|key|auth/i` with `[REDACTED]`.
