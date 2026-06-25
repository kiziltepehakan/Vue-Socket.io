/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        const regex = /password|token|secret|credential|key|auth/i;

        if (data === null || typeof data !== 'object') {
            return data;
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';

        if (!isArray && !isPlainObject) {
            return data;
        }

        seen.add(data);

        if (isArray) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitizedData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (regex.test(key)) {
                    sanitizedData[key] = '[REDACTED]';
                } else {
                    sanitizedData[key] = this.sanitize(data[key], seen);
                }
            }
        }

        return sanitizedData;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...arguments);

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...arguments);

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}