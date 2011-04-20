{Daemon} = require ".."
sys = require "sys"

process.title = "mumbles"

usage = ->
	console.error "usage: mumbles [--room]"
	process.exit -1

configuration = []

daemon = new Daemon(configuration)
daemon.start()
