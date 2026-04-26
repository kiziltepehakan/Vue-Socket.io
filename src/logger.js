/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * 🛡️ Security: Sanitizes data to prevent exposing sensitive information in logs
     */
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object' || data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        seen.add(data);
        const isArr = Array.isArray(data);
        const res = isArr ? [] : {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (!isArr && /password|token|secret|credential|key|auth/i.test(key)) {
                    res[key] = '[REDACTED]';
                } else {
                    res[key] = this.sanitize(data[key], seen);
                }
            }
        }
        seen.delete(data);
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