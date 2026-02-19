/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) {
            const args = Array.from(arguments);
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn() {

        if(this.debug) {
            const args = Array.from(arguments);
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    sanitize(data, depth = 0) {
        if (depth >= 5) return '***MAX DEPTH***';
        if (typeof data !== 'object' || data === null) return data;

        if (data instanceof Date) return data;
        if (data instanceof RegExp) return data;
        if (data instanceof Error) return data;

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, depth + 1));
        }

        const sensitiveKeys = /password|token|secret|credential|api[._-]?key|access[._-]?token/i;
        const sanitized = {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (sensitiveKeys.test(key)) {
                    sanitized[key] = '***REDACTED***';
                } else {
                    sanitized[key] = this.sanitize(data[key], depth + 1);
                }
            }
        }
        return sanitized;
    }

}