/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (data instanceof Date || data instanceof RegExp || data instanceof Error) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        // We only want to clone/traverse plain objects or arrays
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';
        const isArray = Array.isArray(data);

        if (!isPlainObject && !isArray) {
            return data;
        }

        seen.add(data);

        const sanitized = isArray ? [] : {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (sensitiveRegex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }

        return sanitized;
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
