/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    // 🛡️ Sentinel: Sanitize log output to prevent exposing sensitive data like credentials or tokens
    sanitize(data, seen = new Set()) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (seen.has(data)) {
            return '[Circular]';
        }

        if (data instanceof Error || data instanceof Date || data instanceof RegExp) {
            return data;
        }

        if (Array.isArray(data)) {
            seen.add(data);
            const sanitizedArray = data.map(item => this.sanitize(item, seen));
            seen.delete(data);
            return sanitizedArray;
        }

        if (Object.prototype.toString.call(data) !== '[object Object]') {
            return data;
        }

        seen.add(data);
        const sanitizedObject = {};
        const sensitiveRegex = /password|token|secret|credential|key|auth/i;

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (sensitiveRegex.test(key)) {
                    sanitizedObject[key] = '[REDACTED]';
                } else {
                    sanitizedObject[key] = this.sanitize(data[key], seen);
                }
            }
        }
        seen.delete(data);
        return sanitizedObject;
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