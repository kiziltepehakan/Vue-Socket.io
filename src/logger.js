/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        const SENSITIVE_KEYS = /password|token|secret|credential|key|auth/i;
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;

        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        const proto = Object.getPrototypeOf(obj);
        const isPlainObject = proto === Object.prototype || proto === null;

        if (!isPlainObject) {
            return obj;
        }

        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (SENSITIVE_KEYS.test(key)) {
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

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}