## 2023-10-24 - Data Leakage in Logger
**Vulnerability:** The logger class in `src/logger.js` indiscriminately logged all socket event data, which could contain sensitive information like passwords, tokens, and credentials.
**Learning:** Broadly logging raw socket payloads exposes applications to sensitive data leakage. Additionally, naive object traversal for sanitization can crash the application due to circular references or attempting to process binary data. Using `WeakSet` to track visited objects is crucial for safe circular reference handling, and strict type checking prevents crashes on non-plain objects.
**Prevention:** Implement recursive sanitization with circular reference prevention (`WeakSet`) and strict `[object Object]` checks for all incoming log arguments.
