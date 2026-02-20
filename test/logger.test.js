import Logger from '../src/logger';

describe('Logger Security', () => {
    beforeAll(() => {
        if (typeof window === 'undefined') {
            global.window = { console: console };
        }
    });

    beforeEach(() => {
        Logger.debug = true;
        jest.spyOn(console, 'info').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('redacts sensitive data in simple objects', () => {
        const sensitiveData = { password: 'secret_password', username: 'admin' };
        Logger.info('User Login', sensitiveData);

        expect(console.info).toHaveBeenCalled();
        const args = console.info.mock.calls[0];
        expect(args[3].password).toBe('[REDACTED]');
        expect(args[3].username).toBe('admin');
    });

    test('redacts sensitive data in nested objects', () => {
        const nestedData = {
            user: {
                name: 'Alice',
                details: {
                    address: '123 Main St',
                    secretCode: 'xyz'
                }
            }
        };
        Logger.info('Nested Data', nestedData);

        const args = console.info.mock.calls[0];
        expect(args[3].user.name).toBe('Alice');
        // 'secretCode' contains 'secret', so it should be redacted
        expect(args[3].user.details.secretCode).toBe('[REDACTED]');
        expect(args[3].user.details.address).toBe('123 Main St');
    });

    test('redacts entire object if key is sensitive', () => {
        const data = {
            auth: {
                token: 'abc',
                expiry: 123
            }
        };
        Logger.info('Auth Data', data);
        const args = console.info.mock.calls[0];
        expect(args[3].auth).toBe('[REDACTED]');
    });

    test('does not redact harmless keys similar to sensitive ones', () => {
        const harmlessData = {
            author: 'John Doe',
            authority: 'admin',
            authenticationMethod: 'oauth' // This one might be debated but 'auth' only matches exact 'auth'
        };
        Logger.info('Harmless Data', harmlessData);
        const args = console.info.mock.calls[0];

        expect(args[3].author).toBe('John Doe');
        expect(args[3].authority).toBe('admin');
        expect(args[3].authenticationMethod).toBe('oauth');
    });

    test('redacts sensitive data in arrays', () => {
        const listData = [
            { id: 1, secretKey: 'key1' },
            { id: 2, secretKey: 'key2' }
        ];
        Logger.info('List Data', listData);

        const args = console.info.mock.calls[0];
        expect(args[3][0].secretKey).toBe('[REDACTED]');
        expect(args[3][1].secretKey).toBe('[REDACTED]');
        expect(args[3][0].id).toBe(1);
    });

    test('handles circular references gracefully (via depth limit)', () => {
        const circular = { name: 'circular' };
        circular.self = circular;

        Logger.info('Circular Data', circular);

        const args = console.info.mock.calls[0];
        // Expect no crash, and eventually stops
        // Depth 0: circular
        // Depth 1: circular.self
        // ...
        // Depth 6: [MAX DEPTH]

        // Let's traverse to find where it stops
        let current = args[3];
        let depth = 0;
        while (current.self && depth < 10) {
            current = current.self;
            depth++;
        }

        expect(current).toBe('[MAX DEPTH]');
        expect(depth).toBeLessThanOrEqual(6);
    });

    test('respects max depth limit', () => {
        const deepObject = {
            l1: {
                l2: {
                    l3: {
                        l4: {
                            l5: {
                                l6: {
                                    l7: 'too deep'
                                }
                            }
                        }
                    }
                }
            }
        };

        Logger.info('Deep Data', deepObject);
        const args = console.info.mock.calls[0];

        expect(args[3].l1.l2.l3.l4.l5.l6).toBe('[MAX DEPTH]');
    });

    test('sanitizes arguments in error logs', () => {
        const errorData = { credential: 'my-credential' };
        Logger.error('Something went wrong', errorData);

        expect(console.error).toHaveBeenCalled();
        const args = console.error.mock.calls[0];
        // Logger.error implementation: window.console.error(this.prefix, ...sanitizedArgs);
        // args[0] is prefix
        // args[1] is 'Something went wrong' (sanitized string is same)
        // args[2] is errorData (sanitized)

        expect(args[1]).toBe('Something went wrong');
        expect(args[2].credential).toBe('[REDACTED]');
    });
});
