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
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        // Handle plain objects
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sensitiveKeys = /password|token|secret|credential|key|auth/i;
            const result = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (sensitiveKeys.test(key)) {
                        result[key] = '[REDACTED]';
                    } else {
                        result[key] = this.sanitize(data[key], seen);
                    }
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

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}