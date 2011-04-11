// first attempt to connect to campfire from node
// mumblebot, mumblez
var http = require('http');
var https = require('https');

/*******************************************************************************
 * need functionality 
 * 1. Connect Campfire, join a room
 * 2. Listen to Stream
 * 3. React to messages
 *******************************************************************************/

// Basic object to define our connection to campfire
var Campfire = function(name, token) {
  this.name = name;
  this.token = token;
  this.http = https;
  this.port = 443; // hard-coded to SSL for now, biatch
  this.room = 394860; // hard-coded to Danger room
  this.domain = name + ".campfirenow.com";
};

Campfire.prototype.get = function(path, callback) {
  this.request('GET', path, null, callback);
};

Campfire.prototype.post = function(path, body, callback) {
  this.request('POST', path, body, callback);
};

Campfire.prototype.request = function(method, path, body, callback) {
 var headers = { 
    'Authorization' : 'Basic ' + new Buffer(this.token).toString('base64'),
    'host' : this.domain,
    'Content-Type': 'application/json'
  };

  if (method == 'POST') {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    headers['Content-Length'] = body.length;
  }

  var options = {
    host: this.domain,
    port: this.port,
    path: path,
    method: method,
    headers: headers
  };

  var request = this.http.request(options, function(response) {
    var data = "";

    response.on('data', function(chunk) {
      data += chunk;
    });

    response.on('end', function() {
      try {
        data = JSON.parse(data);
      } catch(e) {
      }

      callback(data);
    });
  });

  if (method == 'POST') {
    request.write(body);
  }

  request.end();
};

Campfire.prototype.join = function(callback) {
  this.post('/room/' + this.room + '/join.json', '', callback);
};

Campfire.prototype.listen = function(callback) {

  var headers = { 
    'Authorization': 'Basic ' + new Buffer(this.token).toString('base64'),
    'host' : 'streaming.campfirenow.com',
    'Content-Type': 'application/json'
  };

  var options = {
    host: "streaming.campfirenow.com",
    port: this.port,
    path: '/room/' + this.room + '/live.json',
    method: 'GET',
    headers: headers
  };

  var request = this.http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      if (chunk.trim() === '') {
        return;
      }

      chunk = chunk.split("\r");

      for (var i = 0; i < chunk.length; ++i) {
        if (chunk[i].trim() !== '') {
          try {
            callback(JSON.parse(chunk[i]));
          } catch(e) {}
        }
      }
      
    });
  }).end();
};

var instance = new Campfire('pragma', 'e7086d411145ceb25dae491dae9c1585142bade6:X');

instance.join(function() {
  console.log("joined room");
});

instance.listen(function(data) {
  if(data.type == 'TextMessage') {
    var formumblebot = /mumblebot/.test(data.body);

    if(formumblebot) {
      console.log(data.body.split(/\s/g));
    }
  }
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body>Welcome to Mumblebot Control</body></html>');
}).listen(9400, "0.0.0.0");
