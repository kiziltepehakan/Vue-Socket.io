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

        if (Array.isArray(obj)) {
            seen.add(obj);
            return obj.map(item => this.sanitize(item, seen));
        }

        if (obj.constructor !== Object) {
            return obj; // Only sanitize plain objects
        }

        seen.add(obj);
        const result = {};
        const sensitiveKeys = /password|token|secret|credential|key|auth/i;

        for (const [key, value] of Object.entries(obj)) {
            if (sensitiveKeys.test(key)) {
                result[key] = '[REDACTED]';
            } else {
                result[key] = this.sanitize(value, seen);
            }
        }
        return result;
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