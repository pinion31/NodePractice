const express = require('express');
const app = express();

app.use('*,')

app.listen(3000, () => {
  console.log('app listening on port 3000 at ' + new Date(Date.now()));
});