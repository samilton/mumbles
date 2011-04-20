# Mumblebot

Mumnlebot, affectionately called mumbles, is an extensible Campfire bot.
It is designed to allow anynoe with a working knowledge of Javascript to
add functionality. The syntax is designed to resemble the popular web
framework Sinatra (and its clones like express.js.)

## Goals of the 1.0

  - Configurable
  - Extendable
  - High Level of Code Coverage

## Verbs

  - answer (perform some action)
  - find (search the specified search engine and return the results)
  - get (fetch a url and display the contents)

## Example Syntax

  var bot = Mumblebot.create();

  bot.answer("time", function(args) {
    return new Time();
  });

  bot.answer("find", function(args) {
  });

  bot.answer("get", function(url) {
  });


## License

(The MIT License)

Copyright (c) 2011 Sam Hamilton
Copyright (c) 2011 Pragma Securities, LLC

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

