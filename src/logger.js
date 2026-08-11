/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // Security: Sanitize sensitive data in logs to prevent exposure
    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        if (Array.isArray(data)) {
            seen.add(data);
            return data.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(data) === '[object Object]') {
            seen.add(data);
            const sanitized = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (/password|token|secret|credential|key|auth/i.test(key)) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                        sanitized[key] = this.sanitize(data[key], seen);
                    }
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
        if(this.debug) window.console.error(this.prefix, ...args.map(a => this.sanitize(a)));
    }

    warn(...args) {
        if(this.debug) window.console.warn(this.prefix, ...args.map(a => this.sanitize(a)));
    }

    event(text, data = ''){
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));
    }

}