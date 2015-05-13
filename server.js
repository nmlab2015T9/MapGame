var http = require("http");
var fs = require('fs');

//404 response
function send404Response(response) {
   response.writeHead(404, {"Content-Type": "text/plain"});
   response.write("Error 404: Page not found!");
   response.end();
}

//Handle a user request
function onRequest(req, res) {
   
   if(req.method == 'GET' && req.url == '/') {
      res.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./index.html").pipe(res);
   }
   else {
      send404Response(res);
   }
}
var index = fs.readFileSync('index.html');
var server = http.createServer(onRequest);

server.listen(8080);
console.log("Server is listening");
