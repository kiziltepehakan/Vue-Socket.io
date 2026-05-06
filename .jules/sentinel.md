## 2024-05-06 - Prevent Data Leakage via Console Logs
**Vulnerability:** The application's logger (`VueSocketIOLogger`) was directly logging event payloads to the console when `debug` mode was enabled, without filtering out sensitive data like passwords, tokens, or credentials that might be present in socket messages or Vuex store dispatches.
**Learning:** Console logging, particularly in browser environments with Vuex integrations, can easily leak sensitive user data if object payloads are not sanitized before logging.
**Prevention:** Always implement a sanitization mechanism for any logger class that processes dynamically shaped data, specifically redacting known sensitive keys (e.g., using patterns like `/password|token|secret/i`).
