## 2024-05-24 - Exposed Sensitive Data in Socket.io Logs
**Vulnerability:** The `VueSocketIOLogger` in `src/logger.js` passed all user-supplied data directly to `window.console` methods without filtering. If socket events carried authentication tokens or passwords, this could expose sensitive information to anyone viewing the developer tools or log aggregators.
**Learning:** Even client-side UI integrations that act as bridges (like vue-socket.io for Vue/Vuex) can act as conduits for sensitive data leaks if their debugging mechanisms log the payloads implicitly.
**Prevention:** Always implement a sanitization layer on application loggers that recursively traverses logged objects and obfuscates known sensitive keys before outputting them to the console.
