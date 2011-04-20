(function() {
  var Campfire, Mumblebot, fs, https, sys;
  fs = require("fs");
  sys = require("sys");
  Campfire = require("./campfire");
  https = require("https");
  module.exports = Mumblebot = (function() {
    function Mumblebot(configuration) {
      this.configuration = configuration;
      this.configuration = {
        token: 'xxx:X',
        name: 'samilton',
        roomId: 394860,
        port: 443,
        http: https
      };
      this.campfire = new Campfire(this.configuration);
      this.campfire.join(function() {
        return console.log("joined room");
      });
      this.campfire.listen(function(data) {
        console.log("in callback");
        if (data.type === 'TextMessage') {
          return handleRoute(data);
        }
      });
    }
    Mumblebot.prototype.handleRoute = function(data) {
      this.data = data;
      return console.log("wtf");
    };
    Mumblebot.prototype.leave = function(callback) {
      return this.campfire.leave(callback);
    };
    Mumblebot.prototype.connected = function() {
      return this.campfire.connected;
    };
    return Mumblebot;
  })();
}).call(this);
