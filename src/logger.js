/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize log output to prevent exposing sensitive data (tokens, passwords, etc)
    sanitize(obj, seen = new WeakSet()) {
        if (obj === null || typeof obj !== 'object' || obj instanceof Error || obj instanceof Date || obj instanceof RegExp) return obj;
        if (seen.has(obj)) return '[Circular]';
        seen.add(obj);
        if (Array.isArray(obj)) return obj.map(item => this.sanitize(item, seen));
        const res = {};
        for (const key in obj) {
            res[key] = /password|token|secret|credential|key|auth/i.test(key) ? '[REDACTED]' : this.sanitize(obj[key], seen);
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