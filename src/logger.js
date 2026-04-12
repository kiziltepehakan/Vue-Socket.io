/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) return data;
        if (seen.has(data)) return '[Circular]';
        seen.add(data);
        if (Array.isArray(data)) return data.map(item => this.sanitize(item, new Set(seen)));
        if (Object.prototype.toString.call(data) !== '[object Object]') return data;
        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                sanitized[key] = /password|token|secret|credential|key|auth/i.test(key)
                    ? '[REDACTED]'
                    : this.sanitize(data[key], new Set(seen));
            }
        }
        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn() {

        if(this.debug) {
            const sanitizedArgs = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}
