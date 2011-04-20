(function() {
  var Campfire, http, https;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  http = require("http");
  https = require("https");
  module.exports = Campfire = (function() {
    function Campfire(configuration) {
      var cfn, name, port, roomId, token;
      this.configuration = configuration;
      this.join = __bind(this.join, this);;
      cfn = ".campfirenow.com";
      name = this.configuration.name;
      token = this.configuration.token;
      http = this.configuration.http;
      port = this.configuration.port;
      roomId = this.configuration.roomId;
      this.domain = "" + name + cfn;
      this.signed_on = false;
    }
    Campfire.prototype.request = function(method, path, body, callback) {
      var headers, options, request;
      headers = {
        'Authorization': 'Basic ' + new Buffer(this.configuration.token).toString('base64'),
        'host': this.name + this.cfn,
        'Content-Type': 'application/json'
      };
      if (method === 'POST') {
        if (typeof body !== 'string') {
          body = JSON.stringify(body);
        }
      }
      headers['Content-Length'] = body.length;
      console.log("Preparing to request [" + this.configuration.port + "] from " + this.domain);
      options = {
        host: this.domain,
        port: this.configuration.port,
        path: path,
        method: method,
        headers: headers
      };
      request = this.configuration.http.request(options, __bind(function(response) {
        var data;
        data = "";
        response.on("data", __bind(function(chunk) {
          return data += chunk;
        }, this));
        response.on("end", __bind(function() {
          try {
            data = JSON.parse(data);
          } catch (err) {

          }
          return callback(data);
        }, this));
        if (method === "POST") {
          return request.write(body);
        }
      }, this));
      return request.end();
    };
    Campfire.prototype.get = function(path, callback) {
      return this.request('GET', path, null, callback);
    };
    Campfire.prototype.post = function(path, body, callback) {
      return this.request('POST', path, body, callback);
    };
    Campfire.prototype.join = function(callback) {
      if (this.signed_on === false) {
        this.post('/room/' + this.configuration.roomId + '/join.json', '', callback);
        return this.signed_on = true;
      } else {
        return console.log("can't join same room twice");
      }
    };
    Campfire.prototype.listen = function(callback) {
      var headers, options, request;
      headers = {
        'Authorization': 'Basic ' + new Buffer(this.configuration.token).toString('base64'),
        'host': 'streaming.campfirenow.com',
        'Content-Type': 'application/json'
      };
      options = {
        host: "streaming.campfirenow.com",
        port: this.configuration.port,
        path: '/room/' + this.configuration.roomId + '/live.json',
        method: 'GET',
        headers: headers
      };
      console.log("Listening to room id: [" + this.configuration.roomId + "]");
      request = this.configuration.http.request(options, __bind(function(response) {
        response.setEncoding('utf8');
        return response.on('data', __bind(function(chunk) {
          var c, _fn, _i, _len, _results;
          if (chunk.trim === '') {
            return;
          }
          chunk = chunk.split("\r");
          _fn = __bind(function(c) {}, this);
          _results = [];
          for (_i = 0, _len = chunk.length; _i < _len; _i++) {
            c = chunk[_i];
            _fn(c);
            _results.push((function() {
              if (c.trim() !== '') {
                try {
                  return callback(JSON.parse(c));
                } catch (err) {

                }
              }
            })());
          }
          return _results;
        }, this));
      }, this));
      return request.end();
    };
    Campfire.prototype.leave = function(callback) {
      if (this.signed_on) {
        this.post('/room/' + this.configuration.roomId + '/leave.json', '', callback);
        this.signed_on = false;
        return callback;
      }
    };
    Campfire.prototype.connected = function() {
      return this.signed_on;
    };
    return Campfire;
  })();
}).call(this);
