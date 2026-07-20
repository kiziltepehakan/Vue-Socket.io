/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        // Only process plain objects and arrays
        if (Object.getPrototypeOf(data) !== Object.prototype && !Array.isArray(data)) {
            return data;
        }

        seen.add(data);

        const isArray = Array.isArray(data);
        const copy = isArray ? [] : {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (typeof key === 'string' && /password|token|secret|credential|key|auth/i.test(key)) {
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
        if (this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }
    }

    warn() {
        if (this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }
    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}