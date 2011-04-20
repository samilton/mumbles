http  = require "http"
https = require "https"

module.exports = class Campfire

  # setup the Campfire object to be ready to work with campfire
  # when ever the bot is ready to go.
  constructor: (@configuration) ->
    cfn    = ".campfirenow.com"
    name   = @configuration.name
    token  = @configuration.token
    http   = @configuration.http
    port   = @configuration.port
    roomId = @configuration.roomId
    @domain = "#{name}#{cfn}"
    @signed_on = false

  request: (method, path, body, callback) ->
    headers = {
      'Authorization': 'Basic ' + new Buffer(@configuration.token).toString('base64'),
      'host': this.name + this.cfn,
      'Content-Type': 'application/json'
    }

    if(method is 'POST')
      if(typeof body isnt 'string')
        body = JSON.stringify(body)

    headers['Content-Length'] = body.length

    console.log "Preparing to request [#{@configuration.port}] from #{@domain}"
    options = {
      host: this.domain,
      port: @configuration.port,
      path: path,
      method: method,
      headers: headers
    };

    request = @configuration.http.request options, (response) =>
      data = ""

      response.on "data", (chunk) =>
        data += chunk

      response.on "end", =>
        try
          data = JSON.parse data
        catch err

        callback data

      if method is "POST"
        request.write body

    request.end()

  get: (path, callback) ->
    this.request('GET', path, null, callback)

  post: (path, body, callback) ->
    this.request('POST', path, body, callback)

  join: (callback) =>
    if @signed_on is off
      this.post('/room/' + @configuration.roomId + '/join.json', '', callback)
      @signed_on = true
    else
      console.log "can't join same room twice"

  listen: (callback) ->
    headers = {
      'Authorization': 'Basic ' + new Buffer(@configuration.token).toString('base64'),
      'host' : 'streaming.campfirenow.com',
      'Content-Type': 'application/json'
    }

    options = {
      host: "streaming.campfirenow.com",
      port: @configuration.port,
      path: '/room/' + @configuration.roomId + '/live.json',
      method: 'GET',
      headers: headers
    }

    console.log "Listening to room id: [#{@configuration.roomId}]"
    request = @configuration.http.request options, (response) =>
      response.setEncoding 'utf8'
      response.on 'data', (chunk) =>
        if chunk.trim is ''
          return

        chunk = chunk.split "\r"

        for c in chunk
          do (c) =>
          if c.trim() isnt ''
            try
              callback JSON.parse c
            catch err

    request.end()

  leave: (callback) ->
    if @signed_on
      this.post('/room/' + @configuration.roomId + '/leave.json', '', callback)
      @signed_on = false
      callback

  connected: ->
    return @signed_on
