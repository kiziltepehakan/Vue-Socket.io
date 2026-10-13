/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (seen.has(obj)) return '[Circular]';
        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;

        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';
        if (!isPlainObject && !Array.isArray(obj)) return obj;

        seen.add(obj);
        if (Array.isArray(obj)) return obj.map(item => this.sanitize(item, seen));

        const sanitized = {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sensitiveRegex.test(key) ? '[REDACTED]' : this.sanitize(obj[key], seen);
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

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}