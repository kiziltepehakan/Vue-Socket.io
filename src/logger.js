/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (data == null || typeof data !== 'object') return data;

        if (data instanceof Error) return data;
        if (data instanceof Date) return data;
        if (data instanceof RegExp) return data;

        // Prevent infinite recursion on circular references
        if (seen.has(data)) return '[Circular]';

        // Only process plain objects and arrays
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!isPlainObject && !Array.isArray(data)) return data;

        seen.add(data);

        const sanitized = Array.isArray(data) ? [] : {};
        const pattern = /password|token|secret|credential|key|auth/i;

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