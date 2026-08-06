/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize sensitive data from objects/arrays before logging
    sanitize(obj, seen = new WeakSet()) {
        if (!obj || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (seen.has(obj)) return '[Circular]';

        const isArr = Array.isArray(obj);
        const isPlain = Object.prototype.toString.call(obj) === '[object Object]';
        if (!isArr && !isPlain) return obj;

        seen.add(obj);
        const res = isArr ? [] : {};
        for (const k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                res[k] = /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(obj[k], seen);
            }
        }
        return res;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...args);
        }

    }

    warn() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...args);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}