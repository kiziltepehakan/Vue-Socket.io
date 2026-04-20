/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes data to prevent exposure of sensitive information in logs.
     * Uses a Set to track circular references and avoid infinite recursion.
     */
    sanitize(data, seen = new Set()) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sanitized = {};
            const sensitiveRegex = /password|token|secret|credential|key|auth/i;
            for (const key in data) {
                if (sensitiveRegex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
            return sanitized;
        }

        return data;
    }

    info(text, data = '') {
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

    error(...args) {
        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    warn(...args) {
        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));
    }

    event(text, data = ''){
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}