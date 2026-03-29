## 2024-05-17 - Sensitive Data Exposure in Debug Logs
**Vulnerability:** The library logged all incoming data, including payloads matching `password`, `token`, etc., directly to the browser's developer console when `debug: true` was set.
**Learning:** This could inadvertently expose sensitive user credentials or application secrets to malicious browser extensions or anyone viewing the developer console, especially since this is an integration package. Always sanitize objects before logging, even if it's meant for debug mode.
**Prevention:** Implement recursive object sanitization on logged payloads, handling circular references gracefully (using a `Set`), to scrub values for keys that indicate sensitive data based on common regex patterns.
