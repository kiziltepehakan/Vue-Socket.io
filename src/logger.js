/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        // Security enhancement: Prevent logging of sensitive data
        this.sensitiveKeys = /password|token|secret|credential|key|auth/i;
    }

    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (seen.has(data)) return '[Circular]';
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!isArray && !isPlainObject) return data;

        seen.add(data);
        if (isArray) return data.map(item => this.sanitize(item, seen));

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitized[key] = this.sensitiveKeys.test(key) ? '[REDACTED]' : this.sanitize(data[key], seen);
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
