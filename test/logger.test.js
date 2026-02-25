
import Logger from '../src/logger';

describe('Logger', () => {
    let originalConsoleInfo;
    let originalConsoleError;
    let originalConsoleWarn;

    beforeEach(() => {
        Logger.debug = true;
        // Mock window.console
        if (typeof window === 'undefined') {
            global.window = {
                console: {
                    info: jest.fn(),
                    error: jest.fn(),
                    warn: jest.fn(),
                }
            };
        } else {
            originalConsoleInfo = window.console.info;
            originalConsoleError = window.console.error;
            originalConsoleWarn = window.console.warn;
            window.console.info = jest.fn();
            window.console.error = jest.fn();
            window.console.warn = jest.fn();
        }
    });

    afterEach(() => {
        if (originalConsoleInfo) {
            window.console.info = originalConsoleInfo;
            window.console.error = originalConsoleError;
            window.console.warn = originalConsoleWarn;
        }
    });

    it('should redact sensitive data when debug is true', () => {
        const sensitiveData = {
            password: 'secret_password',
            token: 'secret_token',
            nested: {
                secretKey: 'should_be_redacted',
                public: 'should_stay'
            }
        };
        Logger.info('Test log', sensitiveData);

        expect(window.console.info).toHaveBeenCalled();
        const args = window.console.info.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData.password).toBe('[REDACTED]');
        expect(loggedData.token).toBe('[REDACTED]');
        expect(loggedData.nested.secretKey).toBe('[REDACTED]');
        expect(loggedData.nested.public).toBe('should_stay');
    });

    it('should handle circular references', () => {
        const circular = { name: 'circular' };
        circular.self = circular;

        Logger.info('Circular log', circular);

        expect(window.console.info).toHaveBeenCalled();
        const args = window.console.info.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData.name).toBe('circular');
        expect(loggedData.self).toBe('[CIRCULAR]');
    });

    it('should sanitize arguments in error calls', () => {
        const sensitive = { password: '123' };
        Logger.error('Error occurred', sensitive);

        expect(window.console.error).toHaveBeenCalled();
        const args = window.console.error.mock.calls[0];
        // error(prefix, arg1, arg2...)
        expect(args[1]).toBe('Error occurred'); // string is preserved
        expect(args[2]).toEqual({ password: '[REDACTED]' });
    });
});
