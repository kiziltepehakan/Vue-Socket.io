## 2024-05-18 - [Exposed Sensitive Data in Logs]
**Vulnerability:** The logger printed out potentially sensitive raw payload data to the console, leading to inadvertent credentials leak (e.g. passwords, authentication tokens) if `debug` mode is enabled.
**Learning:** In frontend libraries bridging web sockets to store states, event payloads are often globally logged for debugging. Since payloads can be arbitrary nested objects, it is important to proactively redact sensitive keys to prevent client-side credential exposure.
**Prevention:** Implement a recursive data sanitization method intercepting all logger calls (e.g. `info`, `warn`, `error`, `event`) to strip matching sensitive key values before passing them to `window.console`.
