/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Sentinel: Security Enhancement
     * Recursively sanitizes objects and arrays to prevent logging sensitive data.
     * Prevents leakage of tokens, passwords, and secrets in browser devtools.
     */
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;

        // Handle special objects by just returning them (we assume they don't contain our sensitive keys directly in a risky way)
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        // Prevent infinite loops on circular references and avoid re-injecting raw sensitive data
        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (/password|token|secret|credential|key|auth/i.test(key)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = this.sanitize(value, seen);
            }
        }
        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}