# mumble magic

fs       = require "fs"
sys      = require "sys"
Campfire = require "./campfire"
https    = require "https"

module.exports = class Mumblebot

  constructor: (@configuration) ->
    @configuration = {
      token: 'xxx:X'
      name: 'samilton',
      roomId: 394860,
      port: 443,
      http: https
    }

    @campfire = new Campfire(@configuration)
    @campfire.join ->
      console.log "joined room"

    @campfire.listen (data) ->
      console.log "in callback"
      if data.type is 'TextMessage'
        handleRoute data

  handleRoute: (@data) ->
    console.log "wtf"

  leave: (callback) ->
    @campfire.leave callback

  connected: ->
    return @campfire.connected
