
// Mock window object
global.window = {
  console: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
};

import Logger from '../src/logger';

describe('Logger Security', () => {
  beforeEach(() => {
    Logger.debug = true;
    jest.clearAllMocks();
  });

  test('should redact sensitive keys in info logs', () => {
    const sensitiveData = { password: 'secret_password', token: 'eyJh...', username: 'jdoe' };
    Logger.info('User login', sensitiveData);

    expect(global.window.console.info).toHaveBeenCalledWith(
      expect.stringContaining('Vue-Socket.io: '),
      expect.anything(),
      expect.anything(),
      { password: '***', token: '***', username: 'jdoe' }
    );
  });

  test('should recurse into objects and redact sensitive keys', () => {
    const nestedData = { user: { settings: { secretKey: 'secret' } } };
    Logger.info('Nested', nestedData);

    expect(global.window.console.info).toHaveBeenCalledWith(
      expect.stringContaining('Vue-Socket.io: '),
      expect.anything(),
      expect.anything(),
      { user: { settings: { secretKey: '***' } } }
    );
  });

  test('should handle arrays and redact sensitive keys inside them', () => {
    const arrayData = [{ id: 1, secret: 'A' }, { id: 2, secret: 'B' }];
    Logger.info('Array', arrayData);

    expect(global.window.console.info).toHaveBeenCalledWith(
      expect.stringContaining('Vue-Socket.io: '),
      expect.anything(),
      expect.anything(),
      [{ id: 1, secret: '***' }, { id: 2, secret: '***' }]
    );
  });

  test('should handle circular references gracefully (depth limit)', () => {
    const circular = { a: 1 };
    circular.self = circular;

    Logger.info('Circular', circular);

    const callArgs = global.window.console.info.mock.calls[0];
    const loggedData = callArgs[3];

    expect(loggedData).toHaveProperty('a', 1);

    // Verify that at some depth, recursion stops
    let current = loggedData;
    let depth = 0;
    while(current && typeof current.self === 'object' && depth < 10) {
        current = current.self;
        depth++;
    }

    // If depth reached 10, it means it didn't stop properly or limit is higher.
    // Our limit is 5. So at depth 6 (relative to root), it should return '...'.
    // sanitize(root, 0)
    //   root.self -> sanitize(root, 1)
    //     ...
    //       root.self... -> sanitize(root, 6) -> returns '...'

    expect(current.self).toBe('...');
  });

  test('should redact sensitive keys in error logs', () => {
    const sensitiveData = { password: 'secret_password' };
    Logger.error('Error occurred', sensitiveData);

    expect(global.window.console.error).toHaveBeenCalledWith(
      expect.stringContaining('Vue-Socket.io: '),
      'Error occurred',
      { password: '***' }
    );
  });

  test('should redact sensitive keys in warn logs', () => {
      const sensitiveData = { credential: 'xyz' };
      Logger.warn('Warning', sensitiveData);

      expect(global.window.console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Vue-Socket.io: '),
        'Warning',
        { credential: '***' }
      );
    });
});
