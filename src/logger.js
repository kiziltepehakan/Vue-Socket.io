/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize sensitive data in logs to prevent information leakage
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        seen.add(data);
        const pattern = /password|token|secret|credential|key|auth/i;
        if (Array.isArray(data)) return data.map(item => this.sanitize(item, seen));
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const sanitized = {};
            for (const [k, v] of Object.entries(data)) {
                if (pattern.test(k)) sanitized[k] = '[REDACTED]';
                else sanitized[k] = this.sanitize(v, seen);
            }
            return sanitized;
        }
        return data;
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