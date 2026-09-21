/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(obj, seen = new WeakSet()) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (seen.has(obj)) return '[Circular]';
        if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) return obj;
        if (Array.isArray(obj)) {
            seen.add(obj);
            return obj.map(item => this.sanitize(item, seen));
        }
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            seen.add(obj);
            const result = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (/password|token|secret|credential|key|auth/i.test(key)) {
                        result[key] = '[REDACTED]';
                    } else {
                        result[key] = this.sanitize(obj[key], seen);
                    }
                }
            }
            return result;
        }
        return obj;
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error(...args) {

        if(this.debug) window.console.error(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    warn(...args) {

        if(this.debug) window.console.warn(this.prefix, ...args.map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}