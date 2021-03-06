/*
  Establish RPC connection to server and optionally log in.
*/

var path = require('path');
var fs = require('fs');
var websocket = require('websocket-stream');
var rpc = require('rpc-multistream'); // RPC and multiple streams over one stream
var extend = require('xtend');

var settings = require(path.join(__dirname, '..', '..', 'settings.js'))();
                       
var websocketUrl;
if(settings.ssl) {
  websocketUrl = 'wss://' + settings.hostname;
  if(settings.port !== 443) websocketUrl += ':'+settings.port;
} else {
  websocketUrl = 'ws://' + settings.hostname;
  if(settings.port !== 80) websocketUrl += ':'+settings.port;
}

module.exports = function(opts, callback) {
  if(typeof opts === 'function') {
    callback = opts;
    opts = {}
  }

  opts = extend({
    login: true // can be false or e.g.  {email: 'foo@bar.org', password: 'bar'}
  }, opts || {});

  var account;
  if(opts.login === true) {
    try {
      account = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'test_user.json'),  {encoding: 'utf8'}));
    } catch(e) {
      return callback(new Error("Reading test_user.json failed. Did you create a test user? Hint: You can run `./bin/db.js user test` to create a test user. Or you can specify opts.login.email and opts.login.password"));
    }
  } else if(opts.login) {
    account = opts.login;
}

  var stream = websocket(websocketUrl);

  stream.on('error', function(err) {
    callback(new Error("connection error"));
  });

  stream.on('close', function() {
    if(exiting) return;
    callback(new Error("connection closed"));
  });

  var rpcClient = rpc(null, {
    objectMode: true
  });

  rpcClient.pipe(stream).pipe(rpcClient);

  rpcClient.on('error', function(err) {
    callback(err);
  });

  var exiting;
  function done() {
    exiting = true;
    stream.socket.close();
  }

  rpcClient.on('methods', function (remote) {

    if(!account) return callback(null, done, remote);
    remote.login({
      email: account.email,
      password: account.password
    }, function(err, token, userData) {
      if(err) {
        return callback(new Error("Login failed. Is something wrong with your test user? Hint: You can run `./bin/db.js user test` to re-create a test user."));
      }

      return callback(null, done, remote, userData, token);
    });
  });
};
