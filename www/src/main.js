

var routes = require('./routes.js');
var emailValidator = require('email-validator');
var passwordValidator = require('./password_validator.js');
var settings = require('../../settings.js');

var LabelMaker = require('./labelmaker.js');
var QrCode = require('qrcode-reader');
var getUserMedia = require('getusermedia');
var rpc = require('./rpc.js');

var $ = window.$ // TODO require jquery
window.$.formToObject = require('form_to_object');
window.$.xtend = require('xtend'); // extend that does not modify arguments

// TODO why can't we just do: var app = window.app = require('./app'); ?
import app from './app'
window.app = app // our one global variable (other than jquery)
app.rpc = rpc;
app.initialize() // must be called before UI elements are required

// ----- code below this point will call `app.` methods

var ui = require('./ui')

// TODO is this being imported into the global scope?
// TODO: build plugins as separate modules and scan plugins folder for plugins to install
require('./ui/uitags.js')
require('./plugins/bionet')
require('./plugins/bionet-scanner')
app.startPlugins();

// wait for everything to fully load
$(document).ready(function () {

  console.log("document ready")

  // connect to the server and attempt to log in
  rpc.connect(function(err, remote, user) {
    if(err) {
      console.error("Connection attempt failed. Will continue trying.");
      return;
    }

    app.remote = remote;

    if(user) {
      console.log("Logged in as: ", user);
    } else {
      console.log("Not logged in");

    }

  });
});
