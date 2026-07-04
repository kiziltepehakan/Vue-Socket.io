## 2026-07-04 - [Data Exposure via Logging]
**Vulnerability:** Sensitive data exposure in logs. The logger was dumping full object structures which could contain credentials like passwords and tokens into the browser's console output.
**Learning:** We need to be careful with global, generalized logging structures that can dump full states without checking what properties they might be exposing. Also, circular structure handling is crucial when creating custom recursive JSON formatters.
**Prevention:** Implement a recursive data sanitization method with a WeakSet for circular structure detection and robust prototype checks, and sanitize all data objects before passing them to the console.
