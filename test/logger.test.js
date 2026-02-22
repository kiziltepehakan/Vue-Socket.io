/**
 * @jest-environment jsdom
 */
import Logger from '../src/logger';

describe('Logger Security', () => {
    let consoleInfoSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        // Reset debug state
        Logger.debug = true;
        // Mock console methods
        consoleInfoSpy = jest.spyOn(window.console, 'info').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(window.console, 'warn').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should redact sensitive data in info logs', () => {
        const sensitiveData = {
            password: 'secret_password',
            token: 'abcdef123456',
            user: {
                name: 'Alice',
                auth: {
                    secret: 'super_secret'
                }
            }
        };

        Logger.info('User login', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalled();
        const loggedArgs = consoleInfoSpy.mock.calls[0];
        // The logger format: prefix + text, style1, style2, data
        const loggedData = loggedArgs[3];

        expect(loggedData).not.toEqual(sensitiveData);
        expect(loggedData.password).toBe('[REDACTED]');
        expect(loggedData.token).toBe('[REDACTED]');
        expect(loggedData.user.name).toBe('Alice');
        expect(loggedData.user.auth).toBe('[REDACTED]');
    });

    test('should redact sensitive data in error logs', () => {
         const sensitiveData = { apiKey: '12345-secret' };
         // Since 'apiKey' doesn't match default patterns, let's use a known sensitive key
         const sensitiveData2 = { secretKey: 's3cr3t' };

         Logger.error('Something went wrong', sensitiveData2);

         expect(consoleErrorSpy).toHaveBeenCalled();
         const loggedArgs = consoleErrorSpy.mock.calls[0];
         // error(prefix, arg1, arg2...)
         // arguments[0] is prefix
         // arguments[1] is 'Something went wrong' (string is immutable)
         // arguments[2] is sensitiveData2

         const loggedData = loggedArgs[2];
         expect(loggedData.secretKey).toBe('[REDACTED]');
    });

    test('should handle circular references gracefully (max depth)', () => {
        const circular = {};
        circular.self = circular;

        Logger.info('Circular', circular);

        expect(consoleInfoSpy).toHaveBeenCalled();
        const loggedData = consoleInfoSpy.mock.calls[0][3];
        // self -> self -> self -> self -> self -> self (depth 5)
        // Check deep property
        let current = loggedData;
        for(let i=0; i<5; i++) {
            expect(current.self).toBeDefined();
            current = current.self;
        }
        // At depth 6 (initial call is 0), it should stop or return max depth string
        // verify implementation details:
        // sanitize(obj, 0) -> obj.self = sanitize(obj, 1) ...
        // sanitize(obj, 5) -> returns obj (if depth > 5 check is at top)
        // wait, check implementation: if (depth > 5) return '[MAX DEPTH REACHED]';
        // so sanitize(obj, 6) returns string.

        expect(current.self).toBe('[MAX DEPTH REACHED]');
    });
});
