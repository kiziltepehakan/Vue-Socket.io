/**
 * shitty logger class
 */
const SENSITIVE_KEYS = /password|token|secret|credential|key|auth/i;

export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Sentinel: Sanitize sensitive data before logging
     * Prevent exposure of tokens, passwords, and secrets in browser console
     */
    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(data) !== '[object Object]') return data;

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (SENSITIVE_KEYS.test(key)) {
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

    error(...args) {
        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    warn(...args) {
        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    event(text, data = '') {
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}