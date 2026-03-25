/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Redact sensitive information to prevent exposure in logs
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;

        if (seen.has(data)) return '[Circular]';
        seen.add(data);

        const isArray = Array.isArray(data);
        const isPlainObject = Object.prototype.toString.call(data) === '[object Object]';

        if (!isArray && !isPlainObject) return data;

        const sanitized = isArray ? [] : {};
        // Use a static regex to avoid recompiling it recursively
        const regex = VueSocketIOLogger._sanitizeRegex || (VueSocketIOLogger._sanitizeRegex = /password|token|secret|credential|key|auth/i);

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (typeof key === 'string' && regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }

        seen.delete(data);
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