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

    sanitize(data) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const sensitiveKeys = ['password', 'token', 'access_token', 'secret', 'auth', 'credential', 'apikey'];

        try {
            return JSON.parse(JSON.stringify(data, (key, value) => {
                if (key && sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
                    return '[REDACTED]';
                }
                return value;
            }));
        } catch (e) {
            return data;
        }
    }

}
