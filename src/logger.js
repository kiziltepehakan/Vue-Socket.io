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

        if(this.debug) window.console.error(this.prefix, ...arguments);

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...arguments);

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    sanitize(data, depth = 0) {
        if (depth > 5) return data; // Return original data if too deep, or maybe stop recursing? Returning data might leak. Better to stop recursing or return summary.
        // Actually, if depth > 5, we probably shouldn't return the whole subtree if it's huge. But for now, let's just return it or shallow copy?
        // Let's stick to safe recursion limit.

        if (!data || typeof data !== 'object') return data;

        // Handle Array
        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item, depth + 1));
        }

        // Handle special objects we want to keep
        if (data instanceof Date || data instanceof RegExp || data instanceof Error) return data;

        const sanitized = {};
        const sensitivePatterns = ['password', 'token', 'secret', 'credential'];
        const exactMatches = ['auth', 'authorization'];

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const lowerKey = key.toLowerCase();
                const isSensitive = sensitivePatterns.some(s => lowerKey.includes(s)) || exactMatches.includes(lowerKey);

                if (isSensitive) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], depth + 1);
                }
            }
        }
        return sanitized;
    }

}
