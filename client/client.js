'use strict';

const TestMessage = require('./testmessage_pb');

// ----- This section for hitting the Express server. -----
// const WebSocket = require('ws');
//
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//
// const ws = new WebSocket('wss://localhost:7070/', {
//   origin: 'https://localhost:7070'
// });
//
// ws.on('open', function open() {
//   console.log('connected');
// });
//
// ws.on('close', function close() {
//   console.log('disconnected');
// });
//
// ws.on('message', function incoming(data, flags) {
//   console.log('message');
//   var bytes = Array.prototype.slice.call(data, 0);
//   var message = proto.TestMessage.deserializeBinary(bytes);
//   console.log(message.getSometext());
//   ws.close();
// });
// ----- end for Express server -----

const Nes = require('nes');

var client = new Nes.Client('ws://localhost:7070');
client.connect(err => client.request('hello', (err, data) => {
  if (err) {
    console.log(err);
    throw err;
  }
  // Have to add this here to make data an array-like object so that we can use Array.prototype.slice.call.
  // Something in Hapi is probably wrapping the protobuf because it comes back properly in the Express example.
  data.length = Object.keys(data).length;
  var bytes = Array.prototype.slice.call(data, 0);
  var message = proto.TestMessage.deserializeBinary(bytes);

  console.log(message.getSometext());
}));
