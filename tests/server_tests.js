var tester = require('./tester').tester;
var server = require('../server').server;
var http = require('http');

var mockRes = function(expectedString, done) {
    http.ServerResponse.prototype.end = function(data) {
        tester.isEqual(data.substring(0, expectedString.length),
            expectedString);

        if (done !== undefined) {
            done();
        }
    };

    http.ServerResponse.prototype.writeHead = function(statusCode, responseHeaders) {
    };

    return new http.ServerResponse({});
};

var mockFs = function() {
    this.readFile = function(path, encoding) {
        return "some file stuff";
    };
}

// Demo async tests
tester.test(

    'should serve index.html when go to "/" URL', function(done) {
        server.requestHandler({ url: "/" },
            mockRes("<!doctype", done));
    },

    'should serve client.js when go to "/client.js" URL', function(done) {
        server.requestHandler({ url: "/client.js" },
            mockRes(";(function(exports) {\n  exports.get", done));
    },

    'should get day string when hour between 6 and 20 (exclusive)', function() {
        var Date = function() {
            this.getHours = function() {
                return 11;
            }
        };

        result = server.getDayOrNight();
        tester.isEqual(result, "day");
    },
    'should get night string when hour between 20 and 6 (exclusive)', function() {
        Date = function() {
            this.getHours = function() {
                return 21;
            }
        };

        result = server.getDayOrNight();
        tester.isEqual(result, "night");
    },

    'should get time of day json', function() {
        Date = function() {
            this.getHours = function() {
                return 11;
            }
        };
        server.serveTimeOfDay()(mockRes('{"time": "day"}'));
    }

);