/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (!obj || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }

        // strictly processing only plain objects and arrays
        if (Object.getPrototypeOf(obj) !== Object.prototype && !Array.isArray(obj)) {
            return obj;
        }

        seen.add(obj);
        const isArray = Array.isArray(obj);
        const result = isArray ? [] : {};

        for (const key of Object.keys(obj)) {
            if (!isArray && /password|token|secret|credential|key|auth/i.test(key)) {
                result[key] = '[REDACTED]';
            } else {
                result[key] = this.sanitize(obj[key], seen);
            }
        }
        return result;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        if(this.debug) window.console.error(this.prefix, ...args.map(a => this.sanitize(a)));

    }

    warn(...args) {

        if(this.debug) window.console.warn(this.prefix, ...args.map(a => this.sanitize(a)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}