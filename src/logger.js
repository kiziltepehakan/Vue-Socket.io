/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Redact sensitive data from logs to prevent info leaks
    sanitize(obj, seen = new Set()) {
        if (!obj || typeof obj !== 'object') return obj;
        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (seen.has(obj)) return '[Circular]';

        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        // Only sanitize plain objects to avoid breaking internal socket.io objects
        if (Object.getPrototypeOf(obj) !== Object.prototype && Object.getPrototypeOf(obj) !== null) {
            return obj;
        }

        const sanitized = {};
        const sensitiveKeys = /password|token|secret|credential|key|auth/i;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (sensitiveKeys.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(obj[key], seen);
                }
            }
        }

        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...args);
        }

    }

    warn() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...args);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}