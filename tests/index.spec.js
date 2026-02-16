import VueSocketIO from '../src/index';
import Logger from '../src/logger';
import Listener from '../src/listener';
import Emitter from '../src/emitter';
import SocketIO from 'socket.io-client';

jest.mock('../src/logger', () => ({
    __esModule: true,
    default: {
        debug: false,
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        event: jest.fn()
    }
}));

jest.mock('../src/listener');
jest.mock('../src/emitter');
jest.mock('socket.io-client');

describe('VueSocketIO', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        Logger.debug = false; // Reset debug flag
    });

    it('should set Logger.debug to true', () => {
        new VueSocketIO({
            debug: true,
            connection: 'http://localhost:3000'
        });
        expect(Logger.debug).toBe(true);
    });

    it('should set Logger.debug to false', () => {
        // Set it to true first to ensure it changes
        Logger.debug = true;
        new VueSocketIO({
            debug: false,
            connection: 'http://localhost:3000'
        });
        expect(Logger.debug).toBe(false);
    });

    it('should connect using string connection', () => {
        const connection = 'http://localhost:3000';
        const options = { path: '/socket.io' };
        new VueSocketIO({
            connection,
            options
        });
        expect(SocketIO).toHaveBeenCalledWith(connection, options);
    });

    it('should connect using socket.io instance', () => {
        const socketInstance = { on: jest.fn() };
        new VueSocketIO({
            connection: socketInstance
        });
        expect(SocketIO).not.toHaveBeenCalled();
        expect(Listener).toHaveBeenCalledWith(socketInstance, expect.any(Object));
    });

    it('should instantiate Emitter with vuex', () => {
        const vuex = { store: {} };
        new VueSocketIO({
            connection: 'http://localhost:3000',
            vuex
        });
        expect(Emitter).toHaveBeenCalledWith(vuex);
    });

    it('should instantiate Listener with io and emitter', () => {
        const connection = 'http://localhost:3000';
        // Mock SocketIO implementation to return a specific object
        const mockSocket = { on: jest.fn() };
        SocketIO.mockReturnValue(mockSocket);

        new VueSocketIO({
            connection
        });

        // Get the instance of Emitter created
        const emitterInstance = Emitter.mock.instances[0];

        expect(Listener).toHaveBeenCalledWith(mockSocket, emitterInstance);
    });

    it('should throw error for unsupported connection type', () => {
        expect(() => {
            new VueSocketIO({
                connection: 123
            });
        }).toThrow('Unsupported connection type');
    });

});
