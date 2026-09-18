/**
 * shitty logger class
 */
const SENSITIVE_KEYS = /password|token|secret|credential|key|auth/i;

export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (Object.prototype.toString.call(obj) !== '[object Object]' && !Array.isArray(obj)) return obj;
        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);
        const res = Array.isArray(obj) ? [] : {};
        for (const k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                res[k] = SENSITIVE_KEYS.test(k) ? '[REDACTED]' : this.sanitize(obj[k], seen);
            }
        }
        return res;
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