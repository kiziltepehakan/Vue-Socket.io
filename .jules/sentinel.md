## 2026-06-29 - Prevent Sensitive Data Leak in Logs
**Vulnerability:** The logger class blindly printed all payload properties to the console. If a developer unknowingly logged auth responses or websocket events containing JWTs/passwords, it would leak them into the browser console.
**Learning:** In browser extensions/frontend libs, `window.console` logs persist. Overriding/hooking into log methods with a sanitizer is needed instead of trusting the user's data structure. Additionally, deep cloning for sanitization on DOM nodes/circular structs will cause crashes if not handled with a WeakSet and type limits.
**Prevention:** Always filter logs at the point of emitting to the console with a fast, safe redactor method.
