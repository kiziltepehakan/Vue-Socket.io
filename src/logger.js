/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitize sensitive data before logging
     * @param {*} data
     * @param {WeakSet} seen
     * @returns {*}
     */
    sanitize(data, seen = new WeakSet()) {
        if (typeof data !== 'object' || data === null) return data;

        if (seen.has(data)) return '[Circular]';

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        seen.add(data);

        const sensitivePattern = /password|token|secret|credential|key|auth/i;

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (sensitivePattern.test(key)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = this.sanitize(value, seen);
            }
        }

        return sanitized;
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