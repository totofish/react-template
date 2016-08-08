const path = require('path');
const express = require('express');
const app = express();
const opener = require("opener");
const port = 8080;

app.use(express.static(__dirname + '/dist'));

app.get('/home*', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.get('/page*', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/page.html'));
});


app.listen(port, function () {
  console.info('Release Test Server Start...');
  opener("http://localhost:"+port+"/home");
});
