## 2024-05-18 - [Sensitive Data Exposure]
**Vulnerability:** The logger class was directly logging raw object data which could include sensitive credentials (passwords, tokens, apiKeys, etc) to the browser console.
**Learning:** Browser console logs are accessible to any script running on the page and can be easily copied/pasted, exposing sensitive application state when debug mode is enabled.
**Prevention:** Implement recursive sanitization before passing objects to `console` functions. Filter for common sensitive keys and replace their values with redaction markers. Ensure circular references and primitive types are handled safely to avoid throwing errors during logging.
