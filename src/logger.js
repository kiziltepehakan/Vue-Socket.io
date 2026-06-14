/**
 * shitty logger class
 * 🛡️ Security Note: Implemented sanitization to prevent sensitive data
 * (passwords, tokens, etc.) from leaking to the browser console.
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') return data;

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, new Set(seen)));
        }

        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sanitized = {};
            const regex = /password|token|secret|credential|key|auth/i;
            for (const key in data) {
                if (regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], new Set(seen));
                }
            }
            return sanitized;
        }

        return data; // Ignore binary and other complex objects
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
