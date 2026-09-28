/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize sensitive data to prevent exposure in logs
    sanitize(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }

        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';
        if (!isPlainObject && !Array.isArray(obj)) {
            return obj;
        }

        seen.add(obj);

        const sanitized = Array.isArray(obj) ? [] : {};
        const regex = /password|token|secret|credential|key|auth/i;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(obj[key], seen);
                }
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