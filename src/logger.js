/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(d, s = new WeakSet()) {
        if (!d || typeof d !== 'object' || d instanceof Error || d instanceof Date || d instanceof RegExp) return d;
        if (s.has(d)) return '[Circular]';
        const isArr = Array.isArray(d), isObj = Object.prototype.toString.call(d) === '[object Object]';
        if (!isArr && !isObj) return d;
        s.add(d);
        const res = isArr ? [] : {};
        for (const k in d) {
            if (Object.prototype.hasOwnProperty.call(d, k)) {
                res[k] = !isArr && /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(d[k], s);
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