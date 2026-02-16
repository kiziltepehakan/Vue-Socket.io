import mixin from '../src/mixin';

describe('Mixin', () => {
    let context;
    let mockEmitter;

    beforeEach(() => {
        mockEmitter = {
            removeListener: jest.fn(),
            addListener: jest.fn()
        };
        context = {
            $options: {
                sockets: {
                    event1: jest.fn(),
                    event2: jest.fn()
                }
            },
            $vueSocketIo: {
                emitter: mockEmitter
            }
        };
    });

    describe('beforeDestroy', () => {
        test('should remove listeners defined in sockets options', () => {
            mixin.beforeDestroy.call(context);
            expect(mockEmitter.removeListener).toHaveBeenCalledTimes(2);
            expect(mockEmitter.removeListener).toHaveBeenCalledWith('event1', context);
            expect(mockEmitter.removeListener).toHaveBeenCalledWith('event2', context);
        });

        test('should do nothing if sockets options are missing', () => {
            context.$options.sockets = undefined;
            mixin.beforeDestroy.call(context);
            expect(mockEmitter.removeListener).not.toHaveBeenCalled();
        });

        test('should do nothing if sockets options is null', () => {
            context.$options.sockets = null;
            mixin.beforeDestroy.call(context);
            expect(mockEmitter.removeListener).not.toHaveBeenCalled();
        });
    });
});
