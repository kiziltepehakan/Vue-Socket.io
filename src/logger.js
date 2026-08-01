/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (data === null || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        const isArray = Array.isArray(data);
        const isPlain = Object.prototype.toString.call(data) === '[object Object]';
        if (!isArray && !isPlain) return data;
        seen.add(data);
        if (isArray) return data.map(item => this.sanitize(item, seen));
        const res = {};
        for (const [key, val] of Object.entries(data)) {
            res[key] = /password|token|secret|credential|key|auth/i.test(key) ? '[REDACTED]' : this.sanitize(val, seen);
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