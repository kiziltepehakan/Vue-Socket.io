/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize sensitive data to prevent logging exposures
    sanitize(d, s = new Set()) {
        if (!d || typeof d !== 'object' || d instanceof Error || d instanceof Date || d instanceof RegExp) return d;
        if (s.has(d)) return '[Circular]';
        const isObj = Object.prototype.toString.call(d) === '[object Object]';
        const isArr = Array.isArray(d);
        if (!isObj && !isArr) return d;
        s.add(d);
        const c = isArr ? [] : {};
        for (const k in d) {
            if (Object.prototype.hasOwnProperty.call(d, k)) {
                c[k] = /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(d[k], s);
            }
        }
        s.delete(d);
        return c;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {
        if (!this.debug) return;
        const args = Array.from(arguments).map(arg => this.sanitize(arg));
        window.console.error(this.prefix, ...args);
    }

    warn() {
        if (!this.debug) return;
        const args = Array.from(arguments).map(arg => this.sanitize(arg));
        window.console.warn(this.prefix, ...args);
    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}