var http = require('http');
var fs = require('fs');

var DAY = "day";
var NIGHT = "night";

var server ={
    requestHandler: function (req, res) {
        routes[req.url](res);
    },
    getStaticFile: function(path, contentType) {
        return function(res) {
            fs.readFile(__dirname + path, 'utf8', function (err, data) {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        }
    },
    serveTimeOfDay: function() {
        return function(res) {
            var time = server.getDayOrNight();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end( '{"time": "' + time + '"}');
        }
    },
    getDayOrNight: function() {
        var hour = new Date().getHours();
        var time = hour > 6 && hour < 20 ? DAY : NIGHT;
        return time;
    }
};

var routes = {
    "/" : server.getStaticFile("/index.html", "text/html"),
    "/client.js" : server.getStaticFile("/client.js", "application/javascript"),
    "/canvas-renderer.js" : server.getStaticFile("/canvas-renderer.js", "application/javascript"),
    "/time.json" : server.serveTimeOfDay(),
    "/favicon.ico" : server.getStaticFile("/favicon.ico", "image/x-icon")
};

http.createServer(server.requestHandler).listen(4000);

exports.server = server;

