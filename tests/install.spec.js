import VueSocketIO from '../src/index';
import Mixin from '../src/mixin';
import SocketIO from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    onevent: null,
    emit: jest.fn(),
  }));
});

describe('VueSocketIO.install', () => {
  let vueSocketIO;
  const connectionString = 'http://localhost:3000';
  const options = { debug: false, connection: connectionString };

  beforeEach(() => {
    SocketIO.mockClear();
  });

  test('installs correctly on Vue 3', () => {
    vueSocketIO = new VueSocketIO(options);
    const Vue = {
      version: '3.2.0',
      config: {
        globalProperties: {}
      },
      mixin: jest.fn()
    };

    vueSocketIO.install(Vue);

    expect(Vue.config.globalProperties.$socket).toBeDefined();
    expect(Vue.config.globalProperties.$vueSocketIo).toBe(vueSocketIO);
    expect(Vue.mixin).toHaveBeenCalledWith(Mixin);
  });

  test('installs correctly on Vue 2', () => {
    vueSocketIO = new VueSocketIO(options);
    const Vue = {
      version: '2.6.14',
      prototype: {},
      mixin: jest.fn()
    };

    vueSocketIO.install(Vue);

    expect(Vue.prototype.$socket).toBeDefined();
    expect(Vue.prototype.$vueSocketIo).toBe(vueSocketIO);
    expect(Vue.mixin).toHaveBeenCalledWith(Mixin);
  });

  test('installs correctly on Vue 3 with complex version string', () => {
    vueSocketIO = new VueSocketIO(options);
    const Vue = {
      version: '3.0.0-beta.14',
      config: {
        globalProperties: {}
      },
      mixin: jest.fn()
    };

    vueSocketIO.install(Vue);

    expect(Vue.config.globalProperties.$socket).toBeDefined();
    expect(Vue.config.globalProperties.$vueSocketIo).toBe(vueSocketIO);
    expect(Vue.mixin).toHaveBeenCalledWith(Mixin);
  });
});
