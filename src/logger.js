/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Sentinel: Sanitize sensitive data from logs
     * Replaces values of sensitive keys with '[REDACTED]' to prevent information leakage in browser logs.
     * Safely handles circular references and ensures only plain objects and arrays are processed deeply.
     */
    sanitize(data, seen = new Set()) {
        const regex = /password|token|secret|credential|key|auth/i;
        if (!data || typeof data !== 'object') return data;
        if (seen.has(data)) return '[Circular]';

        if (Array.isArray(data)) {
            seen.add(data);
            return data.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(data) === '[object Object]' &&
           (Object.getPrototypeOf(data) === null || Object.getPrototypeOf(data) === Object.prototype)) {
            seen.add(data);
            const result = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    result[key] = regex.test(key)
                        ? '[REDACTED]'
                        : this.sanitize(data[key], seen);
                }
            }
            return result;
        }
        return data;
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