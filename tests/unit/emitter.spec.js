import EventEmitter from '../../src/emitter';

// Mock Logger to avoid console output during tests
jest.mock('../../src/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  event: jest.fn()
}));

describe('EventEmitter', () => {
  let emitter;
  let mockStore;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      _actions: {},
      _mutations: {}
    };
    jest.clearAllMocks();
  });

  describe('emit', () => {
    it('should call listeners for the event', () => {
      emitter = new EventEmitter({ store: mockStore });
      const eventName = 'testEvent';
      const eventData = { some: 'data' };
      const callback = jest.fn();
      const component = { $options: { name: 'TestComponent' } };

      emitter.addListener(eventName, callback, component);
      emitter.emit(eventName, eventData);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(eventData);
    });

    it('should call dispatchStore for normal events', () => {
      emitter = new EventEmitter({ store: mockStore });
      // Spy on dispatchStore to ensure it's called
      const spy = jest.spyOn(emitter, 'dispatchStore');
      const eventName = 'someEvent';
      const eventData = { foo: 'bar' };

      emitter.emit(eventName, eventData);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(eventName, eventData);
    });

    it('should NOT call dispatchStore for "ping" event', () => {
      emitter = new EventEmitter({ store: mockStore });
      const spy = jest.spyOn(emitter, 'dispatchStore');

      emitter.emit('ping', {});

      expect(spy).not.toHaveBeenCalled();
    });

    it('should NOT call dispatchStore for "pong" event', () => {
      emitter = new EventEmitter({ store: mockStore });
      const spy = jest.spyOn(emitter, 'dispatchStore');

      emitter.emit('pong', {});

      expect(spy).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', () => {
      emitter = new EventEmitter({ store: mockStore });
      const eventName = 'multi';
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const component = { $options: { name: 'Comp' } };

      emitter.addListener(eventName, callback1, component);
      emitter.addListener(eventName, callback2, component);

      emitter.emit(eventName, 'data');

      expect(callback1).toHaveBeenCalledWith('data');
      expect(callback2).toHaveBeenCalledWith('data');
    });

    it('should work correctly when no listeners are registered', () => {
      emitter = new EventEmitter({ store: mockStore });
      const spy = jest.spyOn(emitter, 'dispatchStore');

      // Should not throw
      emitter.emit('unknown', {});

      // Should still try to dispatch to store
      expect(spy).toHaveBeenCalledWith('unknown', {});
    });

    it('should dispatch to store if action exists matching the prefix', () => {
        // Setup store with a matching action
        mockStore._actions = {
            'someModule/SOCKET_testAction': () => {}
        };

        emitter = new EventEmitter({ store: mockStore });

        emitter.emit('testAction', 'payload');

        expect(mockStore.dispatch).toHaveBeenCalledWith('someModule/SOCKET_testAction', 'payload');
    });
  });
});
