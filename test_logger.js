const VueSocketIOLogger = require('./src/logger').default;
const l = VueSocketIOLogger;
l.debug = true;
l.info('Connected', { token: '12345', password: 'password', safe: 'data' });
