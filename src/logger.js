/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (!obj || typeof obj !== 'object') return obj;
        if (obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (seen.has(obj)) return '[Circular]';
        const isPlain = Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null;
        if (!isPlain && !Array.isArray(obj)) return obj;
        seen.add(obj);
        const res = Array.isArray(obj) ? [] : {};
        for (const k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                res[k] = /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(obj[k], seen);
            }
        }
        seen.delete(obj);
        return res;
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