/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;

        // Preserve common non-plain objects
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        // Only process plain objects and arrays to avoid issues with File/Blob/etc
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]' && (data.constructor === Object || data.constructor === undefined);
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        const pattern = /password|token|secret|credential|key|auth/i;

        if (isArray) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (pattern.test(key)) {
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

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}