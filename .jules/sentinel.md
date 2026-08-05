## 2024-05-31 - [Sensitive Data Logging]
**Vulnerability:** Debug logger was blindly logging websocket payloads using window.console, potentially leaking passwords, tokens, and other sensitive credentials directly into the client-side console.
**Learning:** Websocket payloads often contain authentication credentials (especially during login/auth events). Client-side logging MUST sanitize payloads before passing them to `window.console` to avoid unintentional data exposure.
**Prevention:** Implement a recursive sanitize function that scrubs keys matching sensitive patterns (password, token, secret, etc.) before they hit console methods. Always handle circular references and preserve special types (Error, Date) when deeply cloning/sanitizing objects.
