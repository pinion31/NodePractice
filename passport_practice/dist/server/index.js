'use strict';

var express = require('express');
var app = express();
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));

/**
  set routes for actions
*/

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../static', 'index.html'));
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App started at ' + new Date(Date.now()));
});
//# sourceMappingURL=index.js.map