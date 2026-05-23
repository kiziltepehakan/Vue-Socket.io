/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes sensitive data before logging.
     * Prevents leakage of tokens, passwords, secrets, etc.
     */
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
        seen.delete(data);
        return result;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        const args = Array.from(arguments).map(arg => this.sanitize(arg));
        if(this.debug) window.console.error(this.prefix, ...args);

    }

    warn() {

        const args = Array.from(arguments).map(arg => this.sanitize(arg));
        if(this.debug) window.console.warn(this.prefix, ...args);

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}