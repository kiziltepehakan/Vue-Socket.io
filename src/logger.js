/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        this.sensitiveKeys = /password|token|secret|credential|key|auth/i;
    }

    isPlainObject(val) {
        return val !== null && typeof val === 'object' && val.constructor === Object;
    }

    sanitize(data, seen = new Set()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, new Set(seen)));
        }

        if (this.isPlainObject(data)) {
            const result = {};
            for (const key in data) {
                if (this.sensitiveKeys.test(key)) {
                    result[key] = '[REDACTED]';
                } else {
                    result[key] = this.sanitize(data[key], new Set(seen));
                }
            }
            return result;
        }

        return data;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...args);
        }

    }

    warn() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...args);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}