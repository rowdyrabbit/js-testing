var http = require('http');
var fs = require('fs');

var DAY = "day";
var NIGHT = "night";

var contentTypes = {"js" : "application/javascript", "html" : "text/html", "json" : "application/json"};



var server = {
    requestHandler: function (req, res) {
        if (req.url === "/") {
            this.readFile("/index.html", res);
        } else if (req.url === "/client.js") {
            this.readFile(req.url, res);
        } else if (req.url === "/canvas-renderer.js") {
            this.readFile(req.url, res);
        } else if (req.url === "/time.json") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            var timeOfDay = this.getTimeOfDay();
            res.end(this.createJSON("time", timeOfDay));
        }
    },
    readFile: function(path, res) {
        var ext = this.getFileExtension(path);
        fs.readFile(__dirname + path, 'utf8', function (err, data) {
            res.writeHead(200, { 'Content-Type': contentTypes[ext] });
            res.end(data);
        });
    },
    getFileExtension: function(path) {
        console.log("path %s", path);
        var ext = path.substring(path.indexOf(".") + 1, path.length);
        console.log(ext);
        return ext;
    },
    getTimeOfDay: function() {
        var hour = new Date().getHours();
        console.log("###" + hour)
        var time = hour > 6 && hour < 20 ? DAY : NIGHT;

        return time;
    },
    createJSON: function(key, value) {
        return '{ ' + key + ': "' + value + '" }'
    }
};

http.createServer(server.requestHandler).listen(4000);

exports.server = server;