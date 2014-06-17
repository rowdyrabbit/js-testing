var http = require('http');
var fs = require('fs');

var DAY = "day";
var NIGHT = "night";

var server ={
    requestHandler: function (req, res) {
        routes[req.url](res);
    },
    readFile: function(path) {
        var ext = this.getFileExtension(path);
        fs.readFile(__dirname + path, 'utf8', function (err, data) {
            res.writeHead(200, { 'Content-Type': contentTypes[ext] });
            res.end(data);
        });
    },
    getStaticFile: function(path, contentType) {
        return function(res) {
            fs.readFile(__dirname + path, 'utf8', function (err, data) {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        }
    },
    getFileExtension: function(path) {
        console.log("path %s", path);
        var ext = path.substring(path.indexOf(".") + 1, path.length);
        console.log(ext);
        return ext;
    },
    getTimeOfDay: function() {
        return function(res) {
            var hour = new Date().getHours();
            console.log("###" + hour)
            var time = hour > 6 && hour < 20 ? DAY : NIGHT;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end( '{ "time": "' + time + '" }');
        }
    }
};

var routes = {
    "/" : server.getStaticFile("/index.html", "text/html"),
    "/client.js" : server.getStaticFile("/client.js", "application/javascript"),
    "/canvas-renderer.js" : server.getStaticFile("/canvas-renderer.js", "application/javascript"),
    "/time.json" : server.getTimeOfDay(),
    "/favicon.ico" : server.getStaticFile("/favicon.ico", "image/x-icon")
};

http.createServer(server.requestHandler).listen(4000);

exports.server = server;

