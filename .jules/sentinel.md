## 2024-09-02 - Sensitive Data Exposure in Logs
**Vulnerability:** The logger class was directly passing unsanitized application data to the console, risking exposure of sensitive keys like passwords, tokens, or credentials that might be included in Socket.IO payloads.
**Learning:** Due to the dynamic nature of payloads handled by Socket.IO events, it is inherently risky to rely strictly on external validation to prevent sensitive data from reaching the console in a global interceptor or logging singleton.
**Prevention:** Implement recursive filtering and redaction mechanisms directly inside the logging utility to aggressively mask properties matching known sensitive patterns before they reach the output channels.
