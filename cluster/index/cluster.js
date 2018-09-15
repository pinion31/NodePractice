const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i =0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('start', () => {
    console.log(`cluster started`);
  });

  cluster.on('exit',  (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  require('./server.js')();
}