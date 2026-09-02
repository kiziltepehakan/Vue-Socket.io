## 2024-03-24 - Sensitive Data Exposure in Logger
**Vulnerability:** The logger in `VueSocketIOLogger` was logging potentially sensitive data (like Vuex state or event payloads) directly to the console without any sanitization.
**Learning:** Even internal or debug logging in frontend libraries can inadvertently expose sensitive data such as tokens or passwords if event payloads or store states are printed verbatim. Circular references also make sanitization tricky.
**Prevention:** Implement a recursive data sanitization utility inside logging mechanisms that identifies and redacts sensitive keys (`/password|token|secret|credential|key|auth/i`), while gracefully handling circular references and preserving special objects (like `Error` or `Date`).
