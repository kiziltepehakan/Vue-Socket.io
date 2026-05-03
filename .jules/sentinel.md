## 2024-05-24 - [Exposed Sensitive Data in Client Logs]
**Vulnerability:** The client-side logger (`VueSocketIOLogger`) used `window.console` to directly log all incoming/outgoing socket events and payloads, which could expose sensitive data like tokens, passwords, and authentication secrets to the browser console.
**Learning:** Client-side libraries that globally log traffic for debug purposes must include object sanitization to prevent accidental leakage of sensitive fields (especially recursive data structures).
**Prevention:** Always implement a redaction/sanitization step before printing payload contents to the console or third-party loggers, traversing objects using regular expressions for known sensitive keys while handling circular references safely.
