/**
 * Contains all the Audio File Storage related functionality.
 * To serve up static audio files for the moment. To be replaced with an Nginx 
 * and Apache server eventually
 */

var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(5000);