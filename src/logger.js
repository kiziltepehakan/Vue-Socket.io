/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

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

        const isArray = Array.isArray(obj);
        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';

        if (!isArray && !isPlainObject) {
            return obj;
        }

        const result = isArray ? [] : {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof key === 'string' && sensitiveRegex.test(key)) {
                    result[key] = '[REDACTED]';
                } else {
                    result[key] = this.sanitize(obj[key], seen);
                }
            }
        }
        return result;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {
        if (this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }
    }

    warn() {
        if (this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }
    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}