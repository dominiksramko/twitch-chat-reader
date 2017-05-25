const https = require('https'),
      path = require('path'),
      fs = require('fs');

const finalhandler = require('finalhandler'),
      serveStatic = require('serve-static');

var serve = serveStatic(path.join(__dirname, '../dist/'));

var options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
  passphrase: 'put_passphrase_here'
};

var server = https.createServer(options, function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(3000);