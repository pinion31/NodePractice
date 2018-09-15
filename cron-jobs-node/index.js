 const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();


 cron.schedule("* * * * *", function() {
      console.log("running a task every minute. Time is" + new Date(Date.now()));
});

app.listen(3000, () => {
  console.log('Listening on 3000' + new Date(Date.now()));
});