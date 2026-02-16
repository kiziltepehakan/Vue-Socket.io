import VueSocketIOListener from '../src/listener';

describe('VueSocketIOListener', () => {
    let io;
    let emitter;
    let listener;

    beforeEach(() => {
        io = {
            on: jest.fn(),
            onevent: null
        };
        emitter = {
            emit: jest.fn()
        };
        listener = new VueSocketIOListener(io, emitter);
    });

    it('should register onevent listener', () => {
        expect(typeof io.onevent).toBe('function');
    });

    it('should register static events', () => {
        VueSocketIOListener.staticEvents.forEach(event => {
            expect(io.on).toHaveBeenCalledWith(event, expect.any(Function));
        });
    });

    it('should call emitter.emit when onevent is triggered with single argument', () => {
        const event = 'chat message';
        const arg = 'hello';
        const packet = {
            data: [event, arg]
        };

        io.onevent(packet);

        expect(emitter.emit).toHaveBeenCalledWith(event, arg);
    });

    it('should call emitter.emit when onevent is triggered with multiple arguments', () => {
        const event = 'chat message';
        const arg1 = 'hello';
        const arg2 = 'world';
        const packet = {
            data: [event, arg1, arg2]
        };

        io.onevent(packet);

        expect(emitter.emit).toHaveBeenCalledWith(event, [arg1, arg2]);
    });

    it('should call emitter.emit when static event is triggered', () => {
        const event = 'connect';
        const args = {};

        // Find the callback for 'connect'
        const call = io.on.mock.calls.find(call => call[0] === event);
        const callback = call[1];

        callback(args);

        expect(emitter.emit).toHaveBeenCalledWith(event, args);
    });
});
