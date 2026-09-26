import Logger from '../src/logger';

describe('Logger', () => {
    let consoleInfoSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        Logger.debug = true; // Enable debugging to trigger logs
        consoleInfoSpy = jest.spyOn(global.console, 'info').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleInfoSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('should sanitize password and token in info log', () => {
        const sensitiveData = {
            user: 'test_user',
            password: 'my_super_secret_password',
            token: '1234567890abcdef'
        };

        Logger.info('Test Info', sensitiveData);
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            '%cVue-Socket.io: %cTest Info',
            'color: blue; font-weight: 600',
            'color: #333333',
            { user: 'test_user', password: '[REDACTED]', token: '[REDACTED]' }
        );
    });

    it('should recursively sanitize data', () => {
        const deeplyNested = {
            config: {
                auth: {
                    secretKey: 'secret_value'
                }
            }
        };

        Logger.info('Deep Test', deeplyNested);
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            '%cVue-Socket.io: %cDeep Test',
            'color: blue; font-weight: 600',
            'color: #333333',
            { config: { auth: '[REDACTED]' } }
        );
    });

    it('should not sanitize non-objects or ignore normal fields', () => {
        Logger.info('Test Info', 'just a string');
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            '%cVue-Socket.io: %cTest Info',
            'color: blue; font-weight: 600',
            'color: #333333',
            'just a string'
        );
    });

    it('should handle circular references without throwing errors', () => {
        const obj = { normal: 'val' };
        obj.self = obj; // Create circular reference

        Logger.info('Circular', obj);

        expect(consoleInfoSpy).toHaveBeenCalledWith(
            '%cVue-Socket.io: %cCircular',
            'color: blue; font-weight: 600',
            'color: #333333',
            { normal: 'val', self: '[Circular]' }
        );
    });
});
