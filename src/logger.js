/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes data to prevent exposing sensitive information in logs.
     * @param {*} data The data to sanitize.
     * @param {WeakSet} seen Set of already processed objects to handle circular references.
     * @returns {*} Sanitized data.
     */
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]' && (Object.getPrototypeOf(data) === null || Object.getPrototypeOf(data) === Object.prototype);
        if (!isPlainObject && !Array.isArray(data)) {
            return data;
        }
        if (seen.has(data)) {
            return '[Circular]';
        }
        seen.add(data);

        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (sensitiveRegex.test(key)) {
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