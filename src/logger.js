/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }

        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';
        const isArray = Array.isArray(obj);

        if (!isPlainObject && !isArray) {
            return obj;
        }

        seen.add(obj);

        if (isArray) {
            return obj.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        const regex = /password|token|secret|credential|key|auth/i;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (regex.test(key)) {
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