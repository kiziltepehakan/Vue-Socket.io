/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        this.sanitizeRegex = /password|token|secret|credential|key|auth/i;
    }

    sanitize(data, seen = new Set()) {
        if (data === null || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) {
            return data;
        }

        seen.add(data);

        if (isArray) {
            const result = data.map(item => this.sanitize(item, seen));
            seen.delete(data);
            return result;
        }

        const result = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (this.sanitizeRegex.test(key)) {
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