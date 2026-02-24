import Logger from '../src/logger';

describe('Logger Security', () => {
    let infoSpy;
    let warnSpy;
    let errorSpy;

    beforeEach(() => {
        Logger.debug = true;
        infoSpy = jest.spyOn(window.console, 'info').mockImplementation(() => {});
        warnSpy = jest.spyOn(window.console, 'warn').mockImplementation(() => {});
        errorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        infoSpy.mockRestore();
        warnSpy.mockRestore();
        errorSpy.mockRestore();
        Logger.debug = false;
    });

    it('should sanitize sensitive data in info logs', () => {
        const sensitiveData = {
            username: 'user',
            password: 'secretpassword',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            nested: {
                secret: 'supersecret',
                safe: 'value'
            },
            auth: {
                credentials: 'pwd'
            }
        };

        Logger.info('Test log', sensitiveData);

        expect(infoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io:'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                username: 'user',
                password: '***',
                token: '***',
                nested: {
                    secret: '***',
                    safe: 'value'
                },
                auth: '***'
            })
        );
    });

    it('should sanitize sensitive data in warn logs', () => {
        const data = { secretToken: 's3cr3t' };

        Logger.warn('Warning log', data);

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io:'),
            expect.stringContaining('Warning log'),
            expect.objectContaining({
                secretToken: '***'
            })
        );
    });

    it('should sanitize sensitive data in error logs', () => {
        const data = { authorizationHeader: 'Bearer token' };

        Logger.error('Error log', data);

        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io:'),
            expect.stringContaining('Error log'),
            expect.objectContaining({
                authorizationHeader: '***'
            })
        );
    });

    it('should sanitize sensitive data in event logs', () => {
        const data = { password: 'pwd' };

        Logger.event('Event log', data);

        expect(infoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io:'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                password: '***'
            })
        );
    });

    it('should handle circular references gracefully', () => {
        const circular = { name: 'circular' };
        circular.self = circular;
        circular.deep = { parent: circular };

        Logger.info('Circular log', circular);

        expect(infoSpy).toHaveBeenCalled();
        const args = infoSpy.mock.calls[0];
        const loggedData = args[3];

        expect(loggedData.name).toBe('circular');
    });

    it('should handle deep nesting without stack overflow', () => {
        let deep = { level: 0 };
        let current = deep;
        for (let i = 0; i < 100; i++) {
            current.nested = { level: i + 1 };
            current = current.nested;
        }

        Logger.info('Deep log', deep);

        expect(infoSpy).toHaveBeenCalled();
    });

    it('should preserve Error objects', () => {
        const error = new Error('Test Error');

        Logger.error('Error occurred', error);

        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io:'),
            expect.stringContaining('Error occurred'),
            error
        );
    });
});
