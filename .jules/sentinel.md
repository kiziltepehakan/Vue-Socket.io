## 2024-09-10 - Sensitive Data Exposure in Logs
**Vulnerability:** The client-side logger implementation natively passed socket payloads to the browser console. Any tokens, credentials, or sensitive data inside events payload was leaked into developer tools.
**Learning:** Frontend logging systems typically expose the complete raw payload from socket transmissions.
**Prevention:** Always implement a sanitize utility prior to logging client-side logic to ensure attributes matching token/password/credential regex patterns are stripped and replaced securely, preventing leakage even in a debugging context.
