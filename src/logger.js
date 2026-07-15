/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🔒 SECURITY: Sanitize logged data to prevent leaking sensitive information
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!isPlainObject && !Array.isArray(data)) return data;

        seen.add(data);
        const regex = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(data)) return data.map(item => this.sanitize(item, seen));

        const result = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = regex.test(key) ? '[REDACTED]' : this.sanitize(data[key], seen);
            }
        }
        return result;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(a => this.sanitize(a)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(a => this.sanitize(a)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}