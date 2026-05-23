## 2026-05-23 - Data Exposure in Logger
**Vulnerability:** The logger simply logged raw socket event data, which could contain sensitive information like passwords, tokens, and keys without any redaction.
**Learning:** In a realtime socket communication layer, raw data payloads shouldn't be logged directly. A custom sanitizer needed to be built that handled circular references via a `Set`, only parsed plain objects/arrays to avoid destroying native objects (like Error, Date), and redacted keys matching security patterns.
**Prevention:** Always sanitize logs before forwarding them to the console or external logging platforms in middleware/interceptors.
