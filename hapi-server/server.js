'use strict';

// TODO: set up protobuf

const Hapi = require('hapi');
const FileSystem = require('fs');
const Nes = require('nes');
const TestMessage = require('./testmessage_pb');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 7070
  // TODO: this breaks NES.  Should be able to set this here and call over WSS from client.
  // tls: {
  //   key: FileSystem.readFileSync('key.pem'),
  //   cert: FileSystem.readFileSync('cert.pem'),
  //   passphrase: 'test'
  // }
});

// NES provides WS addressability using familiar routing paradigms.
// So this method can be addressed at http://localhost:7070/h
// or at ws://localhost:7070/h (or /hello)
server.register(Nes, err => {
  server.route({
    method: 'GET',
    path: '/h',
    config: {
      id: 'hello',
      encoding: null,
      handler: function(request, reply) {
        console.log('request to /h');

        var message = new proto.TestMessage();
        message.setSometext('Hello Protocol Buffers');
        var bytes = message.serializeBinary();
        return reply(bytes);
      }
    }
  });
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('Hello, world!');
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: function(request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});
