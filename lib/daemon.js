(function() {
  var Daemon, EventEmitter, HttpServer, Mumblebot;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  EventEmitter = require("events").EventEmitter;
  HttpServer = require("./http_server");
  Mumblebot = require("./mumblebot");
  module.exports = Daemon = (function() {
    __extends(Daemon, EventEmitter);
    function Daemon(configurion) {
      this.configurion = configurion;
      this.stop = __bind(this.stop, this);;
      this.httpServer = new HttpServer(this.configuration);
      this.mumbles = new Mumblebot(this.configuration);
      process.on("SIGINT", this.stop);
      process.on("SIGTERM", this.stop);
      process.on("SIGQUIT", this.stop);
    }
    Daemon.prototype.start = function() {
      var flunk, httpPort, pass, startServer;
      if (this.starting || this.started) {
        return;
      }
      this.starting = true;
      startServer = function(server, port, callback) {
        return process.nextTick(function() {
          try {
            return server.listen(port, function() {
              return callback(null);
            });
          } catch (err) {
            return callback(err);
          }
        });
      };
      pass = __bind(function() {
        this.starting = false;
        this.started = true;
        return this.emit("start");
      }, this);
      flunk = __bind(function(err) {
        this.starting = false;
        try {
          this.httpServer.close();
        } catch (_e) {}
        return this.emit("error", err);
      }, this);
      httpPort = 9009;
      return startServer(this.httpServer, httpPort, __bind(function(err) {
        if (err) {
          return flunk(err);
        } else {
          return pass();
        }
      }, this));
    };
    Daemon.prototype.stop = function() {
      var stopServer;
      this.mumbles.leave(function() {
        return console.log("signing off");
      });
      this.mubbles.on("disconnected", function() {
        return process.exit;
      });
      if (this.stopping || !this.started) {
        return;
      }
      this.stopping = true;
      stopServer = function(server, callback) {
        return process.nextTick(function() {
          try {
            close(function() {
              server.removeListener("close", close);
              return callback(null);
            });
            server.on("close", close);
            return server.close();
          } catch (err) {
            return callback(err);
          }
        });
      };
      return stopServer(this.httpServer, __bind(function() {
        this.stopping = false;
        this.started = false;
        return this.emit("stop");
      }, this));
    };
    return Daemon;
  })();
}).call(this);
