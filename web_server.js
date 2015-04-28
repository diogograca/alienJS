/**
 * Basic web server
 */

// Load the http, url, filesystem, and mime modules using the require function
var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');

// Define the base directory from which to load the template
var BASEDIR = 'C:\\users\\Diogo\\Desktop\\UNI\\Web Scripting CW2\\';

// Create a new HTTP server
var server = http.createServer();

// Register an event listener on the "request" event
server.on('request', function (request, response) {
	// Use url.parse to transform the URL string into an object
	var params = url.parse(request.url, true);
	// Load the file to send back
	var file = fs.createReadStream(BASEDIR + params.pathname);
	// On opening the file, set the correct content type
	file.on('open', function() {
		var mime_type = mime.lookup(BASEDIR + params.pathname);
		if(mime_type == 'text/html') {
			mime_type = mime_type + '; charset=utf8';
		}
		console.log('200 ' + params.pathname + ' ' + mime_type);
		response.writeHead(200, {'Content-Type': mime_type});
	});
	// Close the response when all data has been read from the file
	file.on('end', function() {
		response.end();
	});
	// If there is an error, send an error message
	file.on('error', function() {
		console.log('404 ' + params.pathname + ' text/html');
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.write('<html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1>The file you are looking for does not exist.</body></html>');
		response.end();
	});
	file.pipe(response);

});

//Start listening on port 2107 on the loop-back interface
server.listen(2107, '127.0.0.1');