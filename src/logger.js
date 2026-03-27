/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Security: Redact sensitive data from logs to prevent exposing credentials or tokens in the browser console.
     */
    sanitize(obj, seen = new Set()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }

        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) {
            return obj;
        }

        const isArray = Array.isArray(obj);
        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';

        if (!isArray && !isPlainObject) {
            return obj;
        }

        seen.add(obj);
        let result = isArray ? [] : {};
        const keyRegex = /password|token|secret|credential|key|auth/i;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (keyRegex.test(key)) {
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