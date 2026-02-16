import Mixin from '../src/mixin';

describe('Mixin', () => {
    describe('mounted', () => {
        it('should do nothing if this.$options.sockets is undefined', () => {
            const context = {
                $options: {}
            };

            // Should not throw
            Mixin.mounted.call(context);
        });

        it('should register listeners for events in this.$options.sockets', () => {
            const addListener = jest.fn();
            const eventHandler = jest.fn();
            const context = {
                $options: {
                    sockets: {
                        'customEvent': eventHandler
                    }
                },
                $vueSocketIo: {
                    emitter: {
                        addListener
                    }
                }
            };

            Mixin.mounted.call(context);

            expect(addListener).toHaveBeenCalledWith('customEvent', eventHandler, context);
        });

        it('should ignore subscribe and unsubscribe events', () => {
             const addListener = jest.fn();
             const context = {
                 $options: {
                     sockets: {
                         'subscribe': jest.fn(),
                         'unsubscribe': jest.fn(),
                         'otherEvent': jest.fn()
                     }
                 },
                 $vueSocketIo: {
                     emitter: {
                         addListener
                     }
                 }
             };

             Mixin.mounted.call(context);

             expect(addListener).toHaveBeenCalledTimes(1);
             expect(addListener).toHaveBeenCalledWith('otherEvent', expect.any(Function), context);
             expect(addListener).not.toHaveBeenCalledWith('subscribe', expect.anything(), expect.anything());
             expect(addListener).not.toHaveBeenCalledWith('unsubscribe', expect.anything(), expect.anything());
        });
    });
});
