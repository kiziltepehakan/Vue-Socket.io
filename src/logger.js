/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]' &&
            (Object.getPrototypeOf(data) === Object.prototype || Object.getPrototypeOf(data) === null);

        if (Array.isArray(data)) return data.map(item => this.sanitize(item, seen));

        if (isPlainObject) {
            const sanitized = {};
            const regex = /password|token|secret|credential|key|auth/i;
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    sanitized[key] = regex.test(key) ? '[REDACTED]' : this.sanitize(data[key], seen);
                }
            }
            return sanitized;
        }
        return data;
    }

    info(text, data = '') {
        // [SECURITY] Prevent leaking sensitive data in info logs
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

    error(...args) {
        // [SECURITY] Prevent leaking sensitive data in error logs
        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    warn(...args) {
        // [SECURITY] Prevent leaking sensitive data in warn logs
        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    event(text, data = ''){
        // [SECURITY] Prevent leaking sensitive data in event logs
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}