
## 2026-04-28 - Information Leakage via Vue-Socket.io Logger
**Vulnerability:** The `VueSocketIOLogger` in `src/logger.js` indiscriminately logged all data provided to it using `window.console` methods. This could easily expose sensitive information like authentication tokens, passwords, and API keys if they were part of the socket events or emitted objects.
**Learning:** Even seemingly benign utility classes like a "shitty logger class" can become vectors for data exposure. When integrating debugging tools, it's critical to scrub or sanitize the output, particularly because realtime libraries often handle full application states or authentication handshakes.
**Prevention:** Implement a recursive data sanitization method for any custom logging utility that strips or redacts known sensitive keys (`password`, `token`, `secret`, etc.) before passing the object to `window.console` or any external logging service, taking care to avoid issues like infinite loops from circular references.
