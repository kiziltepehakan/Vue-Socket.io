/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data) {
        if (!data) return data;
        if (typeof data !== 'object') return data;

        try {
            const seen = new WeakSet();
            const MAX_DEPTH = 5;

            const redact = (obj, depth = 0) => {
                if (depth > MAX_DEPTH) return '[DEPTH EXCEEDED]';
                if (!obj || typeof obj !== 'object') return obj;
                if (seen.has(obj)) return '[CIRCULAR]';

                // Add to seen only if it's not a primitive wrapper (though those are objects)
                // We use WeakSet so it must be an object.
                seen.add(obj);

                if (Array.isArray(obj)) {
                    return obj.map(item => redact(item, depth + 1));
                }

                if (obj instanceof Date) return obj;
                if (obj instanceof RegExp) return obj;
                if (obj instanceof Error) return obj;

                const newObj = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        if (this.isSensitive(key)) {
                            newObj[key] = '[REDACTED]';
                        } else {
                            newObj[key] = redact(obj[key], depth + 1);
                        }
                    }
                }
                return newObj;
            };

            return redact(data);
        } catch (e) {
            return '[LOGGING ERROR]';
        }
    }

    isSensitive(key) {
        const lowerKey = key.toLowerCase();
        return lowerKey.includes('password') ||
               lowerKey.includes('token') ||
               lowerKey.includes('secret') ||
               lowerKey.includes('credential') ||
               lowerKey === 'auth' ||
               lowerKey === 'authorization';
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
