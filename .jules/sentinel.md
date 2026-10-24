## 2023-10-24 - Fix sensitive data exposure in logs
**Vulnerability:** The logger in `src/logger.js` exposed sensitive data (e.g., passwords, tokens) in development or production debug mode by logging arbitrary objects directly.
**Learning:** Even internal or debug-only loggers must sanitize data to avoid accidentally leaking PII or credentials when users enable debugging or when integrating with error-tracking services. Also, handling circular references and complex types (Date, RegExp, Error) is crucial to avoid crashing or losing debugging observability while sanitizing.
**Prevention:** Implement a recursive sanitization function for all logger inputs that targets keys associated with secrets or credentials, using `WeakSet` to safely handle circular references.
