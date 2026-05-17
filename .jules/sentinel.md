## 2024-05-17 - Prevent Sensitive Data Leak in Console Logger
**Vulnerability:** The `VueSocketIOLogger` was passing raw data (which could include objects with passwords, tokens, API keys) directly to `window.console` methods.
**Learning:** Console logs can leak sensitive user data if they are left enabled or if error logs are piped to logging services, creating a risk of exposure.
**Prevention:** Implement a recursive data sanitization method to redact sensitive keys from plain objects and arrays before logging. Use a Set to handle circular references safely to prevent maximum call stack size exceeded errors.
