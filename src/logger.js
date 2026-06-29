/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes data by redacting sensitive information like passwords and tokens
     * @param {*} data - Data to sanitize
     * @param {WeakSet} seen - Set of seen objects to handle circular references
     * @returns {*} Sanitized data
     */
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object' || data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }
        if (seen.has(data)) return '[Circular]';

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';

        if (!isArray && !isPlainObject) return data;

        seen.add(data);
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;
        const copy = isArray ? [] : {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (!isArray && sensitiveRegex.test(key)) {
                    copy[key] = '[REDACTED]';
                } else {
                    copy[key] = this.sanitize(data[key], seen);
                }
            }
        }
        return copy;
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