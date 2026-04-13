/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new Set()) {
        if (!obj || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);

        if (Array.isArray(obj)) return obj.map(item => this.sanitize(item, seen));

        if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;

        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (/password|token|secret|credential|key|auth/i.test(key)) sanitized[key] = '[REDACTED]';
            else sanitized[key] = this.sanitize(value, seen);
        }
        return sanitized;
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