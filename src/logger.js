/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize log data to prevent exposing sensitive information
    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        // Prevent circular reference errors and handle complex objects
        if (seen.has(data)) return '[Circular]';

        // Only process plain objects and arrays to avoid freezing on DOM nodes, etc.
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!isPlainObject && !Array.isArray(data)) return data;

        seen.add(data);

        const sanitized = Array.isArray(data) ? [] : {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        for (const [key, value] of Object.entries(data)) {
            if (sensitiveRegex.test(key)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = this.sanitize(value, seen);
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