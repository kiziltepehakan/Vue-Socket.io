import Logger from '../src/logger';

describe('Logger Security', () => {
    let consoleSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        // Mock console methods to spy on them
        consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Enable debug mode to ensure logs are written
        Logger.debug = true;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        Logger.debug = false;
    });

    it('should redact sensitive data in info logs', () => {
        const sensitiveData = {
            password: 'supersecretpassword',
            user: {
                token: 'abcdef123456',
                name: 'John Doe',
                apiKey: 'xyz-123'
            }
        };

        Logger.info('User login', sensitiveData);

        expect(consoleSpy).toHaveBeenCalled();
        const args = consoleSpy.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData.password).toBe('[REDACTED]');
        expect(loggedData.user.token).toBe('[REDACTED]');
        expect(loggedData.user.apiKey).toBe('[REDACTED]');
        expect(loggedData.user.name).toBe('John Doe');
    });

    it('should handle circular references without crashing', () => {
        const circularObj = { name: 'Circular' };
        circularObj.self = circularObj;

        Logger.info('Circular Object', circularObj);

        expect(consoleSpy).toHaveBeenCalled();
        const args = consoleSpy.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData.name).toBe('Circular');
        expect(loggedData.self).toBe('[Circular]');
    });

    it('should preserve non-sensitive data', () => {
        const data = {
            id: 123,
            config: {
                theme: 'dark',
                notifications: true
            }
        };

        Logger.info('Config', data);

        expect(consoleSpy).toHaveBeenCalled();
        const args = consoleSpy.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData).toEqual(data);
    });

    it('should sanitize arrays', () => {
        const data = [
            { password: '123' },
            { token: 'abc' },
            { name: 'public' }
        ];

        Logger.info('Array', data);

        expect(consoleSpy).toHaveBeenCalled();
        const args = consoleSpy.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData[0].password).toBe('[REDACTED]');
        expect(loggedData[1].token).toBe('[REDACTED]');
        expect(loggedData[2].name).toBe('public');
    });

    it('should sanitize in error logs', () => {
         const errorData = { secret: 'hidden' };
         Logger.error('Something went wrong', errorData);

         expect(consoleErrorSpy).toHaveBeenCalled();
         const args = consoleErrorSpy.mock.calls[0];
         expect(args[2].secret).toBe('[REDACTED]');
    });

    it('should preserve special objects like Date and Error', () => {
        const date = new Date();
        const error = new Error('Test Error');
        const regex = /test/i;

        const data = {
            date,
            error,
            regex
        };

        Logger.info('Special Objects', data);

        const loggedData = consoleSpy.mock.calls[0][3];

        expect(loggedData.date).toBe(date);
        expect(loggedData.error).toBe(error);
        expect(loggedData.regex).toBe(regex);
    });
});
