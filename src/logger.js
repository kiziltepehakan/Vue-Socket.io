/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        // 🛡️ Security: Pattern for detecting sensitive data keys
        this.sensitiveKeyRegex = /password|token|secret|credential|key|auth/i;
    }

    // 🛡️ Security: Sanitize log data to prevent leaking sensitive information
    sanitize(data, seen = new WeakSet()) {
        if (data === null || data === undefined) return data;
        if (typeof data !== 'object') return data;

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';

        if (!isArray && !isPlainObject) return data;

        if (isArray) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (this.sensitiveKeyRegex.test(key)) {
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

        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    warn(...args) {

        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}