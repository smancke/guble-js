//import var should = require('chai').should(),
import Guble from '../src/main.js';
import assert from 'assert';
import * as mock from 'mock-socket';
//global.WebSocket = global.MockWebSocket;
global.WebSocket = mock.WebSocket;

describe('test sending messages', function() {
    it('send raw data to the server', done => {
      const mockServer = new mock.Server("ws://127.0.0.1:8080/stream/user");
      var messages = [];
      mockServer.on('message', data => messages.push(data));

      var g = new Guble("ws://127.0.0.1:8080/");
      g.connect("user");
      g.sendRaw("Hello World");
      g.sendRaw("foo");
      g.sendRaw("bar");

      setTimeout(() => {
        assert.deepEqual(['Hello World', 'foo', 'bar'], messages);
        done();
      }, 0);

    });
});
