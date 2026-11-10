## 2024-05-19 - [Data Leakage] Sensitive Info Exposed in Socket Logs
**Vulnerability:** Sensitive authentication tokens and passwords could be inadvertently logged to the browser console when socket events contain this data, leading to a potential exposure of user credentials.
**Learning:** `vue-socket.io-v4` exposes a debug logger that prints received events. If an event contains sensitive information (e.g. `login`, `auth`), the payload is logged as-is without redaction.
**Prevention:** Implement a recursive object sanitization function in the logger that scans keys for sensitive keywords (`password`, `token`, `secret`, `credential`, `key`, `auth`) and redacts their values before logging. WeakSets should be used to prevent circular reference errors.
