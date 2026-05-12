## 2024-05-12 - Sensitive Data Exposure in VueSocketIO Logger
**Vulnerability:** The logger in `VueSocketIOLogger` logs raw event payloads directly to `window.console` (info, error, warn, event) without filtering, exposing passwords, tokens, and other sensitive credentials if they are part of socket payloads.
**Learning:** Libraries emitting debug output need generic sanitization logic for arbitrary payloads, since they do not control what developers pass through them.
**Prevention:** Implement a generic key-based object sanitizer for logger payloads before passing them to console methods.
