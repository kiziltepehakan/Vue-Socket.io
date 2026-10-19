## 2024-02-14 - Sensitive Data Exposure in Logs
**Vulnerability:** Unsanitized console logging in the `VueSocketIOLogger` class could expose sensitive application data (like passwords, tokens, or credentials) when `debug` mode is enabled.
**Learning:** Even internal logging mechanisms need robust data sanitization before dumping objects or payloads, as external integrations or production debug flags can accidentally expose secrets. We implemented a recursive object sanitizer using a WeakSet to safely handle circular references without freezing on complex browser objects.
**Prevention:** Always implement a sanitization layer on top of raw console/logging calls and ensure complex payloads are deeply filtered against known sensitive key patterns before outputting.
