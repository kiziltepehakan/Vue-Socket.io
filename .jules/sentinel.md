## 2024-05-24 - [MEDIUM] Fix sensitive data leakage in console logs
**Vulnerability:** Logger exposes sensitive info like tokens, passwords, and API keys directly to the console in browser environments.
**Learning:** Console logs shouldn't implicitly trust incoming objects/data. Data needs sanitization before being logged via window.console.
**Prevention:** Implement sanitization logic intercepting all logger inputs, targeting known sensitive key patterns, and resolving circular references safely.
