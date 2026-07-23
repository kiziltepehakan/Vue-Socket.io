/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
        // Sentinel: Identify sensitive keys that shouldn't be logged
        this.sensitiveKeysRegex = /password|token|secret|credential|key|auth/i;
    }

    // Sentinel: Sanitize sensitive data from objects recursively before logging
    sanitize(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        // Only process plain objects and arrays to avoid freezing on binary data
        if (Object.getPrototypeOf(data) !== Object.prototype && !Array.isArray(data)) {
            return data;
        }

        seen.add(data);

        let sanitized = Array.isArray(data) ? [] : {};

        for (let key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (this.sensitiveKeysRegex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key], seen);
                }
            }
        }

        return sanitized;
    }

    info(text, data = '') {
        if(this.debug) {
            const sanitizedData = this.sanitize(data);
            window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', sanitizedData);
        }
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
        if(this.debug) {
            const sanitizedData = this.sanitize(data);
            window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', sanitizedData);
        }
    }

}