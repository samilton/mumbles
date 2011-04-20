{EventEmitter} = require "events"
HttpServer     = require "./http_server"
Mumblebot      = require "./mumblebot"


module.exports = class Daemon extends EventEmitter
  # Create a new "Daemon" which starts the HttpServer and the Bot
  constructor: (@configurion) ->
    @httpServer = new HttpServer @configuration
    @mumbles = new Mumblebot @configuration

    process.on "SIGINT",  @stop
    process.on "SIGTERM", @stop
    process.on "SIGQUIT", @stop

  start: ->
    return if @starting or @started
    @starting = true

    startServer = (server, port, callback) -> process.nextTick ->
      try
        server.listen port, -> callback null
      catch err
        callback err

    pass = =>
      @starting = false
      @started = true
      @emit "start"

    flunk = (err) =>
      @starting = false
      try @httpServer.close()
      @emit "error", err

    httpPort = 9009
    startServer @httpServer, httpPort, (err) =>
      if err then flunk err
      else pass()

  stop: =>
    # very brute force for now, should be graceful (ie, let mumbles say bye)
    # the real problem is that HttpServer is shutting down
    @mumbles.leave ->
      console.log "signing off"

    @mubbles.on "disconnected", ->
      process.exit

    return if @stopping or !@started
    @stopping = true

    stopServer = (server, callback) -> process.nextTick ->
      try
        close ->
          server.removeListener "close", close
          callback null
        server.on "close", close
        server.close()
      catch err
        callback err

    stopServer @httpServer, =>
      @stopping = false
      @started = false
      @emit "stop"
