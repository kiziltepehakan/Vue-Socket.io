## 2024-05-24 - [Avoid Leaking Sensitive Websocket Event Payload in Consoles]
**Vulnerability:** A verbose debug mode logged raw web socket payloads and user data passed to the events without any filtering.
**Learning:** Hardcoded/raw data structures sent directly to browser console API methods might contain sensitive properties like `password` or `token`. Web Socket clients that implement debug modes must proactively implement object sanitization logic.
**Prevention:** Always recursively process potentially nested object/array structures with a sanitization method mapping sensitive regex keys to strings like `[REDACTED]` prior to feeding them to console APIs. Ensure circular references are safely handled during traversal.
