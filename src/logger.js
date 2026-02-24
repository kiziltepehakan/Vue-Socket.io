/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data, seen = new WeakSet(), depth = 0) {
        const MAX_DEPTH = 5;

        if (depth > MAX_DEPTH) {
            return '[Depth Limit Exceeded]';
        }

        if (data === null || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular Reference]';
        }

        if (data instanceof Date || data instanceof RegExp || data instanceof Error) {
            return data;
        }

        seen.add(data);

        let result;

        if (Array.isArray(data)) {
            result = data.map(item => this.sanitize(item, seen, depth + 1));
        } else {
            result = {};
            const sensitiveKeys = /password|token|secret|credential|auth/i;

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (sensitiveKeys.test(key)) {
                        result[key] = '***';
                    } else {
                        result[key] = this.sanitize(data[key], seen, depth + 1);
                    }
                }
            }
        }

        seen.delete(data);
        return result;
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
