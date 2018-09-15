const amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {

    const q = 'hello';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer('Hello World1!'));
    console.log(" [x] Sent 'Hello World!'");

  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});