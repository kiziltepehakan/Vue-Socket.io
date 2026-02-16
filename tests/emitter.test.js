import EventEmitter from '../src/emitter';
import Logger from '../src/logger';

// Mock Logger
jest.mock('../src/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: false
}));

describe('EventEmitter', () => {
  let emitter;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize Emitter with default options
    emitter = new EventEmitter();
  });

  describe('removeListener', () => {
    it('should remove an existing listener', () => {
      const event = 'testEvent';
      const component = { $options: { name: 'TestComponent' } };
      const callback = jest.fn();

      // Setup listener
      emitter.listeners.set(event, [{ callback, component }]);

      // Execute removeListener
      emitter.removeListener(event, component);

      // Verify listener is removed
      expect(emitter.listeners.has(event)).toBe(false);
      expect(Logger.info).toHaveBeenCalledWith(`#${event} unsubscribe, component: ${component.$options.name}`);
    });

    it('should remove one listener when multiple listeners exist for the same event', () => {
      const event = 'testEvent';
      const component1 = { $options: { name: 'Component1' } };
      const component2 = { $options: { name: 'Component2' } };
      const callback = jest.fn();

      // Setup listeners
      emitter.listeners.set(event, [
        { callback, component: component1 },
        { callback, component: component2 }
      ]);

      // Execute removeListener for component1
      emitter.removeListener(event, component1);

      // Verify correct listener is removed
      const listeners = emitter.listeners.get(event);
      expect(listeners).toHaveLength(1);
      expect(listeners[0].component).toBe(component2);
      expect(Logger.info).toHaveBeenCalledWith(`#${event} unsubscribe, component: ${component1.$options.name}`);
    });

    it('should do nothing if the event does not exist', () => {
      const event = 'nonExistentEvent';
      const component = { $options: { name: 'TestComponent' } };

      // Execute removeListener
      emitter.removeListener(event, component);

      // Verify nothing happened
      expect(emitter.listeners.has(event)).toBe(false);
      // Logger.info should not be called for unsubscribe
      // (The implementation checks if listeners.has(event) first)
      const unsubscribeCalls = Logger.info.mock.calls.filter(call =>
        call[0] && call[0].includes('unsubscribe')
      );
      expect(unsubscribeCalls).toHaveLength(0);
    });

    it('should handle removing a listener that is not subscribed to an existing event', () => {
      const event = 'testEvent';
      const component1 = { $options: { name: 'Component1' } };
      const component2 = { $options: { name: 'Component2' } };
      const callback = jest.fn();

      // Setup listener for component2
      emitter.listeners.set(event, [{ callback, component: component2 }]);

      // Try to remove listener for component1
      emitter.removeListener(event, component1);

      // Verify nothing changed
      const listeners = emitter.listeners.get(event);
      expect(listeners).toHaveLength(1);
      expect(listeners[0].component).toBe(component2);

      // Verify logger call (current implementation logs even if nothing is removed)
      expect(Logger.info).toHaveBeenCalledWith(`#${event} unsubscribe, component: ${component1.$options.name}`);
    });
  });
});
