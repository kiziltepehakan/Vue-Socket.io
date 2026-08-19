## 2026-08-19 - Sensitive Data Exposure in Debug Logs
**Vulnerability:** The logger blindly logged all socket events and Vuex mutations to the console if debug mode was enabled. This could expose sensitive data (e.g., passwords, tokens, API keys) sent through socket events to the browser's console.
**Learning:** Blindly logging event payloads in frontend state sync libraries is dangerous because these payloads often contain sensitive authentication or authorization data.
**Prevention:** Always sanitize or redact sensitive keys from payloads before logging them, especially in libraries that intercept and log arbitrary application state or network events.
