/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitize sensitive data from logs
     * @param {*} data
     * @param {Set} seen
     */
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        if (!Array.isArray(data) && !isPlainObject) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }
        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, new Set(seen)));
        }

        const sanitized = {};
        const regex = /password|token|secret|credential|key|auth/i;
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], new Set(seen));
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