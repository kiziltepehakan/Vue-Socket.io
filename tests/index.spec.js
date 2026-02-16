import VueSocketIO from '../src/index';
import SocketIO from 'socket.io-client';

jest.mock('socket.io-client', () => {
    return jest.fn(() => ({
        on: jest.fn(),
        onevent: null
    }));
});

describe('VueSocketIO', () => {

    beforeEach(() => {
        SocketIO.mockClear();
        // Since Logger is a singleton and debug flag is set on the instance,
        // we might want to reset it or just ensure it doesn't pollute console.
        // But for now, just clearing SocketIO mock is enough.
    });

    it('should connect using a connection string', () => {
        const connectionString = 'http://localhost:3000';
        const options = { path: '/socket.io' };

        // Setup the mock return value for this specific test
        const mockSocket = {
            on: jest.fn(),
            onevent: null
        };
        SocketIO.mockReturnValue(mockSocket);

        const vueSocketIO = new VueSocketIO({ connection: connectionString, options, debug: false });

        expect(SocketIO).toHaveBeenCalledWith(connectionString, options);
        expect(vueSocketIO.io).toBe(mockSocket);
    });

    it('should use the provided socket instance', () => {
        const mockSocket = {
            on: jest.fn(),
            onevent: null
        };

        const vueSocketIO = new VueSocketIO({ connection: mockSocket, debug: false });

        expect(SocketIO).not.toHaveBeenCalled();
        expect(vueSocketIO.io).toBe(mockSocket);
    });

    it('should throw an error for unsupported connection type (number)', () => {
        const invalidConnection = 12345;

        expect(() => {
            new VueSocketIO({ connection: invalidConnection, debug: false });
        }).toThrow('Unsupported connection type');
    });

    it('should throw an error if connection is missing', () => {
        expect(() => {
            new VueSocketIO({ debug: false });
        }).toThrow('Unsupported connection type');
    });

    it('should throw an error for unsupported connection type (null)', () => {
        const invalidConnection = null;

        expect(() => {
            new VueSocketIO({ connection: invalidConnection, debug: false });
        }).toThrow('Unsupported connection type');
    });

    it('should allow connecting manually via connect method', () => {
        const initialMockSocket = { on: jest.fn(), onevent: null };
        const newMockSocket = { on: jest.fn(), onevent: null };

        const vueSocketIO = new VueSocketIO({ connection: initialMockSocket, debug: false });
        expect(vueSocketIO.io).toBe(initialMockSocket);

        // Connect with a new string
        SocketIO.mockReturnValue(newMockSocket);
        const connectionString = 'http://other-host';
        const result = vueSocketIO.connect(connectionString);

        expect(SocketIO).toHaveBeenCalledWith(connectionString, undefined);
        expect(result).toBe(newMockSocket);
        // Note: connect() assigns to this.io
        expect(vueSocketIO.io).toBe(newMockSocket);
    });
});
