/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Sentinel: Recursively sanitize sensitive data before logging
     * Prevent leaking secrets (passwords, tokens, etc.) to the console
     */
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (!Array.isArray(data) && Object.getPrototypeOf(data) !== Object.prototype && Object.getPrototypeOf(data) !== null) {
            return data;
        }

        seen.add(data);

        const isArray = Array.isArray(data);
        const copy = isArray ? [] : {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (!isArray && sensitiveRegex.test(key)) {
                    copy[key] = '[REDACTED]';
                } else {
                    copy[key] = this.sanitize(data[key], seen);
                }
            }
        }

        seen.delete(data);
        return copy;
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