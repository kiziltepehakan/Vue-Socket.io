/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // Security: Prevents sensitive data from leaking into console logs
    sanitize(obj, seen = new Set()) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular]';
        }
        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(obj) === '[object Object]') {
            const sanitized = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (/password|token|secret|credential|key|auth/i.test(key)) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                        sanitized[key] = this.sanitize(obj[key], seen);
                    }
                }
            }
            return sanitized;
        }

        return obj;
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