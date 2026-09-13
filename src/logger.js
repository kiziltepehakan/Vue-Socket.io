/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        this.sensitiveRegex = /password|token|secret|credential|key|auth/i;
    }

    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') {
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

        const proto = Object.getPrototypeOf(data);
        if (proto !== null && proto !== Object.prototype) {
            return data;
        }

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (this.sensitiveRegex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }
        return sanitized;
    }

    info(text, data = '') {
        // 🛡️ Sentinel: Sanitize sensitive data in logs to prevent exposure
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

    error() {
        // 🛡️ Sentinel: Sanitize sensitive data in error logs
        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...args);
        }
    }

    warn() {
        // 🛡️ Sentinel: Sanitize sensitive data in warning logs
        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...args);
        }
    }

    event(text, data = ''){
        // 🛡️ Sentinel: Sanitize sensitive data in event logs
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}