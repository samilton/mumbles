fs      = require "fs"
sys     = require "sys"
connect = require "connect"

{dirname, join, exists} = require "path"

# need to review some quirks in connect that are exposed in
# github/pow but not sure if they affect mumbles
#
# TODO Make this shutdown gracefully
#
module.exports = class HttpServer extends connect.HTTPServer

  # Borrowed from pow (http://github/37_signals/pow for now
  # mostly because they are the masters of everything awesome
  # but really because I'm too lazy to figure it out RFN.
  o = (fn) -> (req, res, next)      -> fn req, res, next
  x = (fn) -> (err, req, res, next) -> fn err, req, res, next

  constructor: (@configuation) ->
    super [
      o @logRequest
      o @handleRequest
    ]

    @on "close", =>

  logRequest: (req, res, next) =>
    console.log "[#{req.socket.remoteAddress}] #{req.method} #{req.url}"
    next()

  handleRequest: (req, res, nex) =>
    res.writeHead 200, "Content-Type": "text/html"
    res.end """
      <!doctype html>
        <html>
        <head>
          <title>Mumbles says hi</title>
        </head>

        <body>
        </body>
        </html>
    """
