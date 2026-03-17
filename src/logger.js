/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes sensitive data from logs
     * @param {*} data
     * @param {Set} seen
     * @returns {*}
     */
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        // Avoid destroying observability of complex structures and prevent freezing the main thread
        // with binary objects
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) {
            return data;
        }

        seen.add(data);

        let result;
        if (isArray) {
            result = [];
            for (let i = 0; i < data.length; i++) {
                result[i] = this.sanitize(data[i], seen);
            }
        } else {
            result = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (/password|token|secret|credential|key|auth/i.test(key)) {
                        result[key] = '[REDACTED]';
                    } else {
                        result[key] = this.sanitize(data[key], seen);
                    }
                }
            }
        }

        // Remove from seen to allow the same object to be processed again in a different branch
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