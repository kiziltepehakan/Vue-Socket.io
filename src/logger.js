/**
 * shitty logger class
 */
export default new class VueSocketIOLogger {

    constructor() {
        this.debug = false;
        this.prefix = '%cVue-Socket.io: ';
    }

    sanitize(data) {
        const seen = new WeakSet();

        const sanitizeNode = (node) => {
            if (node === null || typeof node !== 'object') {
                return node;
            }

            if (node instanceof Error || node instanceof Date || node instanceof RegExp) {
                return node;
            }

            if (seen.has(node)) {
                return '[Circular]';
            }
            seen.add(node);

            if (Array.isArray(node)) {
                return node.map(item => sanitizeNode(item));
            }

            const sanitized = {};
            const regex = /password|token|secret|credential|key|auth/i;
            for (const key of Object.keys(node)) {
                if (regex.test(key)) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = sanitizeNode(node[key]);
                }
            }
            return sanitized;
        }

        return sanitizeNode(data);
    }

    info(text, data = '') {

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

    error() {

        if(this.debug) window.console.error(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    warn() {

        if(this.debug) window.console.warn(this.prefix, ...Array.from(arguments).map(arg => this.sanitize(arg)));

    }

    event(text, data = ''){

        if(this.debug) window.console.info(this.prefix+`%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', this.sanitize(data));

    }

}