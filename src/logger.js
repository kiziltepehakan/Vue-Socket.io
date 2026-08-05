/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // Security: Sanitize sensitive data from logs
    sanitize(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;

        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);

        const sensitivePattern = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        // Only process plain objects to avoid breaking internal classes/observability
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                if (sensitivePattern.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(value, seen);
                }
            }
            return sanitized;
        }

        return obj;
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

    event(text, data = ''){
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}