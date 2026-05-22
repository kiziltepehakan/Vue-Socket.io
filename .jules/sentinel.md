## 2024-05-22 - Secure Logger Implementation
**Vulnerability:** Debug logs inadvertently exposed sensitive user data (passwords, tokens, etc.) passed within socket event payloads.
**Learning:** Debug logs often capture complete data structures. When these structures contain credentials, enabling debugging (even temporarily) risks data exposure. A generic sanitizer for logs is a necessary defense-in-depth measure.
**Prevention:** Implement a centralized `sanitize` method within the logger class to recursively filter out properties matching sensitive keywords (e.g., `password`, `token`) before data is written to the console.
