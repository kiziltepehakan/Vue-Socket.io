/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }
        if (seen.has(data)) {
            return '[Circular]';
        }

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) {
            return data;
        }

        seen.add(data);
        const pattern = /password|token|secret|credential|key|auth/i;

        if (isArray) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (pattern.test(key)) {
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

    error() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}