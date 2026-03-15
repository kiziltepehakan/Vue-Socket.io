/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Security: Sanitize sensitive data from logs to prevent information exposure
     * Handles circular references safely
     */
    sanitize(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }

        seen.add(obj);

        const sensitiveKeys = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const [k, v] of Object.entries(obj)) {
            if (sensitiveKeys.test(k)) {
                sanitized[k] = '[REDACTED]';
            } else {
                sanitized[k] = this.sanitize(v, seen);
            }
        }

        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}