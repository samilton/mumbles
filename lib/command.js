(function() {
  var Daemon, configuration, daemon, sys, usage;
  Daemon = require("..").Daemon;
  sys = require("sys");
  process.title = "mumbles";
  usage = function() {
    console.error("usage: mumbles [--room]");
    return process.exit(-1);
  };
  configuration = [];
  daemon = new Daemon(configuration);
  daemon.start();
}).call(this);
