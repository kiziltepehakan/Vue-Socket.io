import VueSocketIOLogger from '../src/logger';

describe('VueSocketIOLogger', () => {
    let consoleSpy;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        // Set debug mode to true to enable logging
        VueSocketIOLogger.debug = true;
    });

    afterEach(() => {
        // Restore console
        if (consoleSpy) {
            consoleSpy.mockRestore();
        }
    });

    it('should log info message when debug is true', () => {
        consoleSpy = jest.spyOn(window.console, 'info').mockImplementation(() => {});
        const text = 'test message';
        const data = 'test data';

        VueSocketIOLogger.info(text, data);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('%c' + text),
            'color: blue; font-weight: 600',
            'color: #333333',
            data
        );
    });

    it('should not log info message when debug is false', () => {
        VueSocketIOLogger.debug = false;
        consoleSpy = jest.spyOn(window.console, 'info').mockImplementation(() => {});

        VueSocketIOLogger.info('test');

        expect(consoleSpy).not.toHaveBeenCalled();
    });
});
