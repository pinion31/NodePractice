'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
const dog = new EventEmitter();
const async = require('async');

dog.on('bark', () => {
  console.log('Woof');
});

router.get('/hello', (req, res, next) => {
  res.status(200).send({ message: 'Hello' });
});

router.get('/bark', (req, res, next) => {
  dog.emit('bark');
  res.end('Bark');
});

router.get('/read-line', (req, res, next) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What is your name?', name => {
    console.log(`Hello ${name}!`);
    rl.close();
    res.status(200).send(`Hello ${name}!`);
  });
});

router.get('/spawn-process', (req, res, next) => {
  const execFile = require('child_process').execFile;
  const child = execFile('node', ['--version'], (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    console.log(stdout);
  });
});

router.get('/async-callback', (req, res, next) => {
  function shortTimeFunction(callback) {
    setTimeout(function () {
      callback(null, 'resultOfShortTime');
    }, 200);
  }
  function mediumTimeFunction(callback) {
    setTimeout(function () {
      callback(null, 'resultOfMediumTime');
    }, 500);
  }
  function longTimeFunction(callback) {
    setTimeout(function () {
      callback(null, 'resultOfLongTime');
    }, 1000);
  }
  async.parallel([shortTimeFunction, mediumTimeFunction, longTimeFunction], function (err, results) {
    if (err) {
      return console.error(err);
    }
    res.send(results);
  });
});

router.get('/read-file', (req, res, next) => {
  try {
    const readFile = fs.createReadStream(path.resolve(__dirname, 'test1.txt'), { encoding: 'utf8', highWaterMark: 16 * 1024 });
    const writeFile = fs.createWriteStream(path.resolve(__dirname, 'write.txt'));

    readFile.on('error', error => {
      // if file does not exist
      next(error);
    });

    readFile.on('data', chunk => {
      const newChunk = chunk.replace(/trump/gim, 'Orange Asshole'); // replace all instances of trump
      writeFile.write(newChunk);
    });

    readFile.on('end', () => {
      res.status(200).send('Done reading file');
    });
  } catch (err) {
    return next(err);
  }
});

router.use((err, req, res, next) => {
  if (err) {
    console.log('Error! ', err);
  }

  res.end();
});

router.get('/test-error', (req, res, next) => {
  var data;

  try {
    data = JSON.parse('/file.json');
  } catch (err) {
    return next(err);
  }

  if (!data) {
    throw new Error('Smth wrong');
  }

  res.status(200).send('OK');
});

module.exports = router;
//# sourceMappingURL=routes.js.map