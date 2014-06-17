var tester = require('./tester').tester;
var server = require('../server').server;
var http = require('http');

var mockRes = function(expectedString, done) {
    http.ServerResponse.prototype.end = function(data) {
        tester.isEqual(data.substring(0, expectedString.length),
            expectedString);
        console.log("assertion checked");

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
        console.log("read file");
        return "some file stuff";
    };
}

// Demo async tests
tester.test(

    'should get file extension form path', function() {
        var result = server.getFileExtension("/client.js");
        tester.isEqual(result, "js");
        console.log("successass")
    },

    'should serve index.html when go to "/" URL', function(done) {
        server.requestHandler({ url: "/" },
            mockRes("<!doctype", done));
    },

    'should serve client.js when go to "/client.js" URL', function(done) {
        server.requestHandler({ url: "/client.js" },
            mockRes(";(function(exports) {\n  exports.get", done));
    },

    'should get day string when hour between 6 and 20 (exclusive)', function() {
        // mock
        var Date = function() {
            this.getHours = function() {
                return 11;
            }
        }

        result = server.getTimeOfDay();
        tester.isEqual(result, "day");
    },

    'should read file with given path', function(done) {
        server.readFile("/client.js", mockRes(";(function(exports) {\n  exports.get", done));
    }

//  'should create json from key and value', function() {
//        result = server.createJSON("time", "day");
//        tester.isEqual(result, '{"time"}')
//    }
);