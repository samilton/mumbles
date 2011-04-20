(function() {
  var HttpServer, connect, dirname, exists, fs, join, sys, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  fs = require("fs");
  sys = require("sys");
  connect = require("connect");
  _ref = require("path"), dirname = _ref.dirname, join = _ref.join, exists = _ref.exists;
  module.exports = HttpServer = (function() {
    var o, x;
    __extends(HttpServer, connect.HTTPServer);
    o = function(fn) {
      return function(req, res, next) {
        return fn(req, res, next);
      };
    };
    x = function(fn) {
      return function(err, req, res, next) {
        return fn(err, req, res, next);
      };
    };
    function HttpServer(configuation) {
      this.configuation = configuation;
      this.handleRequest = __bind(this.handleRequest, this);;
      this.logRequest = __bind(this.logRequest, this);;
      HttpServer.__super__.constructor.call(this, [o(this.logRequest), o(this.handleRequest)]);
      this.on("close", __bind(function() {}, this));
    }
    HttpServer.prototype.logRequest = function(req, res, next) {
      console.log("[" + req.socket.remoteAddress + "] " + req.method + " " + req.url);
      return next();
    };
    HttpServer.prototype.handleRequest = function(req, res, nex) {
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      return res.end("<!doctype html>\n  <html>\n  <head>\n    <title>Mumbles says hi</title>\n  </head>\n\n  <body>\n  </body>\n  </html>");
    };
    return HttpServer;
  })();
}).call(this);
