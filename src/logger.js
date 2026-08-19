/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Security enhancement: Sanitizes sensitive data before logging.
     * Prevents accidentally leaking passwords, tokens, or other secrets
     * in the console logs when debug mode is enabled.
     */
    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') {
            return data;
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]' &&
            (Object.getPrototypeOf(data) === Object.prototype || Object.getPrototypeOf(data) === null);

        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        seen.add(data);

        if (isArray) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        const regex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }

        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        if(this.debug) {
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn(...args) {

        if(this.debug) {
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}
