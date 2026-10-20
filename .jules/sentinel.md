## 2024-05-24 - Information Leakage in Logs
**Vulnerability:** Exposed sensitive data (e.g., passwords, tokens) in logs (`src/logger.js`). The logger indiscriminately logged object contents provided via incoming WebSocket events or actions without any sanitization.
**Learning:** Generic loggers that handle untrusted or dynamic state data (like Socket.IO packet payloads) inherently risk capturing sensitive credentials if the payload objects are dumped directly into `console.info` or `console.error`.
**Prevention:** Implement recursive redaction logic to filter out common sensitive keys before serializing or passing objects to output streams.
