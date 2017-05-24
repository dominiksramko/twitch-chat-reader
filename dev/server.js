const http = require('http'),
      path = require('path');

const finalhandler = require('finalhandler'),
      serveStatic = require('serve-static');

var serve = serveStatic(path.join(__dirname, '../dist/'));

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8000);