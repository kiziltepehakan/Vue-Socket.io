/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new Set()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        // Preserve native objects
        if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) {
            return obj;
        }

        // Handle circular references
        if (seen.has(obj)) {
            return '[Circular]';
        }
        seen.add(obj);

        const sensitiveKeys = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        // Only process plain objects to avoid breaking complex structures
        if (obj.constructor !== Object && obj.constructor !== undefined) {
            return obj;
        }

        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (sensitiveKeys.test(key)) {
                    result[key] = '[REDACTED]';
                } else {
                    result[key] = this.sanitize(obj[key], seen);
                }
            }
        }
        return result;
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