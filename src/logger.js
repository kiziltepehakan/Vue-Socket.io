/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') return data;
        if (seen.has(data)) return '[Circular]';
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!isArray && !isPlainObject) return data;

        seen.add(data);
        const sanitized = isArray ? [] : {};
        const regex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (!isArray && regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }
        seen.delete(data);
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