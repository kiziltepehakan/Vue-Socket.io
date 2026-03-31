/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes data to prevent leaking sensitive information in logs.
     * @param {*} data
     * @param {Set} seen
     * @returns {*}
     */
    sanitize(data, seen = new Set()) {
        if (data === null || data === undefined) return data;

        // Preserve native types that shouldn't be sanitized or iterated
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        // Prevent infinite recursion on circular references
        if (typeof data === 'object') {
            if (seen.has(data)) return '[Circular]';
            seen.add(data);
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        // Only sanitize plain objects to avoid breaking complex instances
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sanitized = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (/password|token|secret|credential|key|auth/i.test(key)) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                        sanitized[key] = this.sanitize(data[key], seen);
                    }
                }
            }
            return sanitized;
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