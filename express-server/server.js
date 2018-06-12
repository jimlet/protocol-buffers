'use strict';

const TestMessage = require('./testmessage_pb');
const Express = require('Express');
const Https = require('https');
const WebSocket = require('ws');
const FileSystem = require('fs');

const app = Express();
app.use((req, res) => res.send({msg: "hello"}));

const server = Https.createServer({
  key: FileSystem.readFileSync('key.pem'),
  cert: FileSystem.readFileSync('cert.pem'),
  passphrase: 'test'
}, app);
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws) {
  ws.on('message', message => console.log('received:%s', message));

  var message = new proto.TestMessage();
  message.setSometext('Hello Protocol Buffers');

  var bytes = message.serializeBinary();
  ws.send(bytes);
});

server.listen(7070, () => console.log('Listening on %d', server.address().port));
