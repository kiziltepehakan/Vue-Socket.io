/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    /**
     * Sanitizes sensitive data from logs
     */
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') return data;
        if (seen.has(data)) return '[Circular]';

        // Preserve specific types that are objects but don't need deep traversal or cloning in the same way
        if (data instanceof Date || data instanceof RegExp || data instanceof Error) return data;

        seen.add(data);

        try {
            const result = Array.isArray(data) ? [] : {};
            const sensitiveKeys = /password|token|secret|credential|key|auth/i;

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (sensitiveKeys.test(key)) {
                        result[key] = '[REDACTED]';
                    } else {
                        result[key] = this.sanitize(data[key], seen);
                    }
                }
            }
            return result;
        } catch (e) {
            return '[Sanitization Error]';
        }
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

}