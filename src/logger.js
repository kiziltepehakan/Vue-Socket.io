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

    sanitize(data, depth = 0) {
        if (depth > 5) return '[Depth Limit Reached]';
        if (typeof data !== 'object' || data === null) return data;

        try {
            const sanitized = Array.isArray(data) ? [] : {};

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const value = data[key];
                    const lowerKey = key.toLowerCase();

                    if (lowerKey.includes('password') ||
                        lowerKey.includes('token') ||
                        lowerKey.includes('secret') ||
                        lowerKey.includes('auth') ||
                        lowerKey.includes('credential')) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                         sanitized[key] = this.sanitize(value, depth + 1);
                    }
                }
            }
            return sanitized;
        } catch (e) {
            return '[Unable to sanitize data]';
        }
    }

}
