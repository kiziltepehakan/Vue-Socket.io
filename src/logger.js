/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize sensitive data from logs to prevent information exposure
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object' || data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        const isArr = Array.isArray(data);
        const isPlain = Object.prototype.toString.call(data) === '[object Object]';
        if (!isArr && !isPlain) return data;
        seen.add(data);
        const result = isArr ? [] : {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = (!isArr && /password|token|secret|credential|key|auth/i.test(key)) ? '[REDACTED]' : this.sanitize(data[key], seen);
            }
        }
        seen.delete(data);
        return result;
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