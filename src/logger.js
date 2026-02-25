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
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.error(this.prefix, ...args);
        }

    }

    warn() {

        if(this.debug) {
            const args = Array.from(arguments).map(arg => this.sanitize(arg));
            window.console.warn(this.prefix, ...args);
        }

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    sanitize(obj, depth = 0, seen = new WeakSet()) {
        if (depth > 5) return '[DEPTH EXCEEDED]';
        if (obj === null || typeof obj !== 'object') return obj;
        if (seen.has(obj)) return '[CIRCULAR]';

        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitize(item, depth + 1, seen));
        }

        if (obj instanceof Date) return obj;
        if (obj instanceof RegExp) return obj;
        if (obj instanceof Error) return obj;

        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('password') ||
                    lowerKey.includes('token') ||
                    lowerKey.includes('secret') ||
                    lowerKey.includes('credential') ||
                    lowerKey.includes('auth')) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(obj[key], depth + 1, seen);
                }
            }
        }
        return sanitized;
    }

}
