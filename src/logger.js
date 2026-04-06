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
        const proto = Object.getPrototypeOf(obj);
        if (proto !== null && proto !== Object.prototype) return obj;
        const sanitized = {};
        for (const [k, v] of Object.entries(obj)) {
            sanitized[k] = /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(v, seen);
        }
        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(a => this.sanitize(a)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(a => this.sanitize(a)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}