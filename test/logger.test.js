import Logger from '../src/logger';

describe('Logger Security', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        Logger.debug = true;
        jest.spyOn(window.console, 'info').mockImplementation(() => {});
        jest.spyOn(window.console, 'warn').mockImplementation(() => {});
        jest.spyOn(window.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        Logger.debug = false;
    });

    test('should redact sensitive data in info', () => {
        const sensitiveData = { password: 'secret_password', email: 'test@example.com' };
        Logger.info('User login', sensitiveData);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                password: '[REDACTED]',
                email: 'test@example.com'
            })
        );
    });

    test('should NOT redact generic keys', () => {
        const data = {
            key: 'value',
            socketKey: 'socket',
            tokenizer: 'test',
            keyboard: 'qwerty'
        };
        Logger.info('Generic check', data);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                key: 'value',
                socketKey: 'socket',
                tokenizer: 'test',
                keyboard: 'qwerty'
            })
        );
    });

    test('should redact token variations', () => {
        const data = {
            accessToken: 'secret',
            user_token: 'secret',
            csrfToken: 'secret',
            apiKey: 'secret',
            api_key: 'secret'
        };
        Logger.info('Token check', data);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                accessToken: '[REDACTED]',
                user_token: '[REDACTED]',
                csrfToken: '[REDACTED]',
                apiKey: '[REDACTED]',
                api_key: '[REDACTED]'
            })
        );
    });

    test('should preserve Date and RegExp', () => {
        const date = new Date('2023-01-01');
        const regex = /test/;
        const data = { date, regex };
        Logger.info('Type check', data);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                date: date,
                regex: regex
            })
        );
    });

    test('should redact sensitive data in warn', () => {
        const sensitiveData = { token: 'secret_token' };
        Logger.warn('Warning check', sensitiveData);

        expect(window.console.warn).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            'Warning check',
            expect.objectContaining({ token: '[REDACTED]' })
        );
    });

    test('should redact sensitive data in error', () => {
        const sensitiveData = { secret: 'super_secret' };
        Logger.error('Error check', sensitiveData);

        expect(window.console.error).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            'Error check',
            expect.objectContaining({ secret: '[REDACTED]' })
        );
    });

    test('should handle circular references', () => {
        const obj = { name: 'circular' };
        obj.self = obj;
        Logger.info('Circular check', obj);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                name: 'circular',
                self: '[Circular]'
            })
        );
    });

    test('should handle depth limit', () => {
        const deepObj = { level1: { level2: { level3: { level4: { level5: { level6: { level7: 'too deep' } } } } } } };
        Logger.info('Depth check', deepObj);

        expect(window.console.info).toHaveBeenCalledWith(
            expect.stringContaining('Vue-Socket.io'),
            expect.any(String),
            expect.any(String),
            expect.objectContaining({
                level1: expect.objectContaining({
                    level2: expect.objectContaining({
                        level3: expect.objectContaining({
                            level4: expect.objectContaining({
                                level5: expect.objectContaining({
                                    level6: '[Depth Limit]'
                                })
                            })
                        })
                    })
                })
            })
        );
    });
});
