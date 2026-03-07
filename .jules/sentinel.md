## 2026-03-07 - Sensitive Data Exposure in Browser Console Logs
**Vulnerability:** The logger module logged raw data, including tokens and passwords, to the browser console when debug mode was enabled.
**Learning:** Client-side libraries shouldn't blindly log raw request data/state, as sensitive user credentials or tokens might get unintentionally exposed in the developer console. Even if debug mode is "off" by default, turning it on could leak secrets during development or debugging sessions.
**Prevention:** Implement an object sanitation mechanism inside logger classes that automatically redacts values for keys matching known sensitive patterns (like "password", "token", "secret", "key", "auth", "credential").
