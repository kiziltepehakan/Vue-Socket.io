## 2024-11-05 - Log Sanitization of Sensitive Data
**Vulnerability:** The logger directly passed un-sanitized objects to `window.console` in `info`, `warn`, `error`, and `event` methods, potentially exposing sensitive data (e.g., passwords, tokens) if a debug event included user or authentication information.
**Learning:** Even client-side libraries must implement log sanitization if they offer debugging features that echo arbitrary event payloads to the console.
**Prevention:** Always implement a sanitation layer before passing data to logging mechanisms, taking care to handle complex nested objects, arrays, and circular references to avoid breaking observability.
