/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Security: Sanitize sensitive data before logging to console to prevent data leakage
    sanitize(d, seen = new Set()) {
        if (d === null || typeof d !== 'object' || d instanceof Error || d instanceof Date || d instanceof RegExp) return d;
        if (seen.has(d)) return '[Circular]';
        seen.add(d);
        if (Array.isArray(d)) return d.map(i => this.sanitize(i, new Set(seen)));
        if (Object.prototype.toString.call(d) === '[object Object]') {
            const res = {}, rx = /password|token|secret|credential|key|auth/i;
            for (const k in d) res[k] = rx.test(k) ? '[REDACTED]' : this.sanitize(d[k], new Set(seen));
            return res;
        }
        return d;
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