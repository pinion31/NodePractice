const http = require('http');

function startServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello Http');
  });

  server.listen(3000, () => {
    console.log('app listening on port 3000 at ' + new Date(Date.now()));
  });
}

if (!module.parent) {
  //startServer();
} else {
  module.exports = startServer;
}
