
import Logger from '../src/logger';

describe('Logger', () => {
    let consoleInfoSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        Logger.debug = true;
        consoleInfoSpy = jest.spyOn(window.console, 'info').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(window.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        Logger.debug = false;
        jest.restoreAllMocks();
    });

    it('redacts sensitive data in info', () => {
        const sensitiveData = { password: 'secret123' };
        Logger.info('test', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io: '),
            expect.anything(),
            expect.anything(),
            { password: '[REDACTED]' }
        );
    });

    it('redacts sensitive data in event', () => {
        const sensitiveData = { token: 'abc-123' };
        Logger.event('event', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io: '),
            expect.anything(),
            expect.anything(),
            { token: '[REDACTED]' }
        );
    });

    it('redacts sensitive data in deeply nested objects', () => {
        const sensitiveData = {
            user: {
                details: {
                    secret: 'hidden'
                }
            }
        };
        Logger.info('test', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io: '),
            expect.anything(),
            expect.anything(),
            {
                user: {
                    details: {
                        secret: '[REDACTED]'
                    }
                }
            }
        );
    });

    it('redacts exact match for auth', () => {
         const sensitiveData = {
            user: {
                auth: {
                    some: 'data'
                }
            }
        };
        Logger.info('test', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io: '),
            expect.anything(),
            expect.anything(),
            {
                user: {
                    auth: '[REDACTED]'
                }
            }
        );
    });

    it('handles arrays', () => {
        const sensitiveData = [{ password: '123' }];
        Logger.info('test', sensitiveData);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io: '),
            expect.anything(),
            expect.anything(),
            [{ password: '[REDACTED]' }]
        );
    });

    it('handles circular references gracefully', () => {
        const circular = {};
        circular.self = circular;
        Logger.info('test', circular);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            { self: '[CIRCULAR]' }
        );
    });
});
