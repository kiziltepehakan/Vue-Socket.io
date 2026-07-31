/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;

        // Preserve standard object types that shouldn't be recursed or redacted directly
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        const copy = isArray ? [] : {};
        const regex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (regex.test(key)) {
                    copy[key] = '[REDACTED]';
                } else {
                    copy[key] = this.sanitize(data[key], seen);
                }
            }
        }

        return copy;
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