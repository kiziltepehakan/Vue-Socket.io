/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object' || data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';

        const isArray = Array.isArray(data);
        const isPlain = Object.prototype.toString.call(data) === '[object Object]';
        if (!isArray && !isPlain) return data;

        seen.add(data);
        const result = isArray ? [] : {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (/password|token|secret|credential|key|auth/i.test(key)) {
                    result[key] = '[REDACTED]';
                } else {
                    result[key] = this.sanitize(data[key], seen);
                }
            }
        }
        return result;
    }

    info(text, data = '') {

        // 🛡️ Sentinel: Sanitize log data to prevent sensitive data exposure
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        // 🛡️ Sentinel: Sanitize log data to prevent sensitive data exposure
        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    warn(...args) {

        // 🛡️ Sentinel: Sanitize log data to prevent sensitive data exposure
        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        // 🛡️ Sentinel: Sanitize log data to prevent sensitive data exposure
        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}