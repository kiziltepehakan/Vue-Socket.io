## 2024-10-25 - Exposed Sensitive Data in Logs
**Vulnerability:** The logger class (`src/logger.js`) logs arguments without sanitizing sensitive information like passwords, tokens, and secrets.
**Learning:** Naive sanitization attempts can crash on circular references and binary data. A secure sanitizer must handle circular objects safely (using `WeakSet`) and only process plain objects and arrays to avoid destroying observability.
**Prevention:** Always implement a reliable sanitizer for logging mechanisms, ensuring it safely handles complex object structures while redacting sensitive keys matching patterns like `/password|token|secret|credential|key|auth/i`.
