## 2024-05-18 - Sensitive Data Leakage in Logger
**Vulnerability:** The logger (`src/logger.js`) in debug mode was printing unsanitized user payload data to the console, exposing sensitive information like passwords, tokens, auth keys, etc.
**Learning:** Even internal logging mechanisms can lead to sensitive data exposure in client-side libraries. The logger did not implement any sanitization before printing to the console object.
**Prevention:** Always implement sanitization logic in global logging components that redacts sensitive key names via pattern matching before emitting data to any observable stream (like console, files, or network).
