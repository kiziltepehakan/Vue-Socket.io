export default {

    /**
     *  Assign runtime callbacks
     */
    beforeCreate(){

        if(!this.sockets) this.sockets = {};

        this.sockets._dynamicEvents = [];

        this.sockets.subscribe = (event, callback) => {
            this.$vueSocketIo.emitter.addListener(event, callback, this);

            if (!this.sockets._dynamicEvents.includes(event)) {
                this.sockets._dynamicEvents.push(event);
            }
        };

        this.sockets.unsubscribe = (event) => {
            this.$vueSocketIo.emitter.removeListener(event, this);

            const index = this.sockets._dynamicEvents.indexOf(event);
            if (index > -1) {
                this.sockets._dynamicEvents.splice(index, 1);
            }
        };

    },

    /**
     * Register all socket events
     */
    mounted(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                if(event !== 'subscribe' && event !== 'unsubscribe') {
                    this.$vueSocketIo.emitter.addListener(event, this.$options.sockets[event], this);
                }

            });

        }

    },

    /**
     * unsubscribe when component unmounting
     */
    beforeDestroy(){

        if(this.$options.sockets){

            Object.keys(this.$options.sockets).forEach(event => {

                this.$vueSocketIo.emitter.removeListener(event, this);

            });

        }

        if (this.sockets && this.sockets._dynamicEvents) {

            this.sockets._dynamicEvents.forEach(event => {

                this.$vueSocketIo.emitter.removeListener(event, this);

            });

        }

    }

}