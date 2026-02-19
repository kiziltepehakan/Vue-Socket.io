import Logger from '../src/logger';

// Mock window.console
global.window = {
  console: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
};

describe('Logger Security', () => {
  beforeEach(() => {
    Logger.debug = true;
    jest.clearAllMocks();
  });

  test('should redact sensitive keys in info', () => {
    const sensitive = {
        password: 'secret',
        token: '12345',
        user: 'me',
        nested: {
            api_key: 'abcdef',
            access_token: 'xyz',
            credential: 'cred'
        }
    };

    Logger.info('test', sensitive);

    const args = window.console.info.mock.calls[0];
    const loggedData = args[3];

    expect(loggedData.password).toBe('***REDACTED***');
    expect(loggedData.token).toBe('***REDACTED***');
    expect(loggedData.user).toBe('me');
    expect(loggedData.nested.api_key).toBe('***REDACTED***');
    expect(loggedData.nested.access_token).toBe('***REDACTED***');
    expect(loggedData.nested.credential).toBe('***REDACTED***');
  });

  test('should NOT redact safe keys like auth (too broad)', () => {
      const data = { auth: 'true', isAuthenticated: true, author: 'me' };
      Logger.info('safe', data);
      const args = window.console.info.mock.calls[0];
      const loggedData = args[3];

      expect(loggedData.auth).toBe('true');
      expect(loggedData.isAuthenticated).toBe(true);
      expect(loggedData.author).toBe('me');
  });

  test('should handle max depth', () => {
      const deep = { a: { b: { c: { d: { e: { f: 'too deep' } } } } } };
      // depth 0: deep
      // depth 1: a
      // depth 2: b
      // depth 3: c
      // depth 4: d
      // depth 5: e (this is >= 5, so it should be redacted/stopped)

      Logger.info('deep', deep);
      const args = window.console.info.mock.calls[0];
      const loggedData = args[3];

      expect(loggedData.a.b.c.d.e).toBe('***MAX DEPTH***');
  });

  test('should handle arrays', () => {
      const data = [{ password: '123' }, { token: 'abc' }];
      Logger.info('array', data);
      const args = window.console.info.mock.calls[0];
      const loggedData = args[3];

      expect(loggedData[0].password).toBe('***REDACTED***');
      expect(loggedData[1].token).toBe('***REDACTED***');
  });

  test('should preserve Dates and Errors', () => {
      const date = new Date('2023-01-01');
      const err = new Error('oops');

      Logger.info('date', date);
      const dateArgs = window.console.info.mock.calls[0];
      expect(dateArgs[3]).toBeInstanceOf(Date);

      Logger.info('error', err);
      const errArgs = window.console.info.mock.calls[1];
      expect(errArgs[3]).toBeInstanceOf(Error);
  });
});
