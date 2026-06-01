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
        if (!isArray && Object.prototype.toString.call(data) !== '[object Object]') return data;

        seen.add(data);
        const result = isArray ? [] : {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (/password|token|secret|credential|key|auth/i.test(key)) {
                    result[key] = '[REDACTED]';
                } else {
                    result[key] = this.sanitize(data[key], seen);
                }
            }
        }

        seen.delete(data);
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