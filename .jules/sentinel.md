## 2025-05-01 - Sensitive Data Exposure in Client-Side Logger

**Vulnerability:** Client-side console logs (`VueSocketIOLogger`) were inadvertently dumping sensitive state such as tokens, passwords, and authentication credentials transmitted via Vuex or direct socket events, exposing them in the browser's developer console.

**Learning:** Any custom logger added to client-side libraries that directly passes arguments into `window.console` must sanitize output when dealing with application state. Circular references require special care (via a `Set` to track visited nodes) and special native objects (`Error`, `Date`, etc.) should be preserved to avoid destroying observability and memory leaks.

**Prevention:** Always implement a sanitization layer on client-facing loggers to redact known sensitive keys (e.g., using regex `/password|token|secret|credential|key|auth/i`) before writing to the browser console.
