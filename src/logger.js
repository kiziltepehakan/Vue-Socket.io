/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, depth = 0) {
        if (!data || typeof data !== 'object') return data;
        if (data instanceof Date || data instanceof RegExp || data instanceof Error) return data;
        if (depth > 5) return '[MAX DEPTH]';

        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, depth + 1));
        }

        const sanitized = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const lowerKey = key.toLowerCase();
                const isSensitive =
                    lowerKey === 'auth' ||
                    lowerKey === 'authorization' ||
                    lowerKey.includes('password') ||
                    lowerKey.includes('token') ||
                    lowerKey.includes('secret') ||
                    lowerKey.includes('credential');

                if (isSensitive) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], depth + 1);
                }
            }
        }
        return sanitized;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        if(this.debug) {
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...sanitizedArgs);
        }

    }

    warn(...args) {

        if(this.debug) {
            const sanitizedArgs = args.map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...sanitizedArgs);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}
