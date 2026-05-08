## 2024-05-08 - Data Leakage in Client-side Logging
**Vulnerability:** Sensitive data (passwords, tokens, secrets) could be leaked in plaintext to the browser's developer console when debug logging was enabled for Socket.io events.
**Learning:** Client-side loggers, especially those that broadcast arbitrary event data like Vue-Socket.io, must never implicitly trust that the data they are given is safe for logging.
**Prevention:** Implemented a `sanitize` method on the logger class to recursively filter payload keys matching sensitive keywords (password, token, auth, etc.) and replace them with `[REDACTED]`.
