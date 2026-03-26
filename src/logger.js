/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new Set()) {
        if (obj === null || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        const isPlainObject = Object.prototype.toString.call(obj) === '[object Object]';
        if (!isPlainObject && !Array.isArray(obj)) return obj;
        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);
        const targetKeyRegex = /password|token|secret|credential|key|auth/i;
        if (Array.isArray(obj)) {
            const arr = obj.map(item => this.sanitize(item, seen));
            seen.delete(obj);
            return arr;
        }
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = targetKeyRegex.test(key) ? '[REDACTED]' : this.sanitize(obj[key], seen);
            }
        }
        seen.delete(obj);
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