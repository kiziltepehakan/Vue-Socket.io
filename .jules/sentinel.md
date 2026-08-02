## 2024-10-24 - [Information Disclosure in Logger]
**Vulnerability:** The logger outputted raw objects to the console, allowing information disclosure of sensitive variables like passwords, tokens, API keys, and credentials if they are part of logged payload when debug mode is enabled.
**Learning:** Third party logging utilities (especially for browsers) that accept arbitrary data structures must implement recursive sanitization to strip keys related to PII or security tokens to avoid unintentional data leakage in browser consoles.
**Prevention:** Always wrap payloads with a recursive dictionary sanitizer before passing them directly to window.console methods. Use safe weak sets to avoid crash by infinite recursion on circular objects.
