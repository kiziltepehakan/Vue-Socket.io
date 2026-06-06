/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // Security enhancement: Sanitize logged objects to prevent leaking secrets
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        seen.add(data);
        if (Array.isArray(data)) {
            const arr = data.map(item => this.sanitize(item, seen));
            seen.delete(data);
            return arr;
        }
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sanitized = {};
            const regex = /password|token|secret|credential|key|auth/i;
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (regex.test(key)) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                        sanitized[key] = this.sanitize(data[key], seen);
                    }
                }
            }
            seen.delete(data);
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