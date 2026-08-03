/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // Security: Sanitize sensitive data from logs to prevent exposure
    sanitize(obj, seen = new WeakSet()) {
        if (!obj || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';
        if (!isPlainObject && !Array.isArray(obj)) return obj;
        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);

        const pattern = /password|token|secret|credential|key|auth/i;
        if (Array.isArray(obj)) return obj.map(item => this.sanitize(item, seen));

        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = pattern.test(key) ? '[REDACTED]' : this.sanitize(obj[key], seen);
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