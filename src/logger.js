/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize log data to prevent exposing sensitive information
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Date || data instanceof RegExp || data instanceof Error) return data;
        if (seen.has(data)) return '[CIRCULAR]';

        seen.add(data);

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, seen));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (/password|token|secret|credential|key|auth/i.test(key)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = this.sanitize(value, seen);
            }
        }
        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    warn(...args) {

        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}