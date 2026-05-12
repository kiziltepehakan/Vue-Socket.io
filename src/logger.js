/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Prevent sensitive data exposure in logs
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object' || data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        const isPlain = Object.prototype.toString.call(data) === '[object Object]';
        if (!isPlain && !Array.isArray(data)) return data;

        seen.add(data);
        const result = Array.isArray(data) ? [] : {};
        for (const k in data) {
            if (Object.prototype.hasOwnProperty.call(data, k)) {
                result[k] = /password|token|secret|credential|key|auth/i.test(k) ? '[REDACTED]' : this.sanitize(data[k], seen);
            }
        }
        return result;
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