var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var staticBasePath = '/static';

var serve = serveStatic(staticBasePath, {'index': false});

var server = http.createServer(function(req, res){
    var done = finalhandler(req, res);
    serve(req, res, done);
})

server.listen(7282);