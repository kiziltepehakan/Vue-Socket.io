/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new Set()) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        // Avoid destroying specific objects
        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        // Handle circular references
        if (seen.has(data)) {
            return '[Circular]';
        }

        // Only process plain objects and arrays
        if (Array.isArray(data)) {
            seen.add(data);
            return data.map(item => this.sanitize(item, seen));
        }

        if (Object.prototype.toString.call(data) === '[object Object]') {
            seen.add(data);
            const sanitized = {};
            const regex = /password|token|secret|credential|key|auth/i;
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (regex.test(key)) {
                        sanitized[key] = '[REDACTED]';
                    } else {
                        sanitized[key] = this.sanitize(data[key], seen);
                    }
                }
            }
            return sanitized;
        }

        return data; // Return unchanged for other types (e.g. Map, Set, binary data)
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

}
