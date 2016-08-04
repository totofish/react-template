var path = require('path');
var express = require('express');
var app = express();
var opener = require("opener");
var port = 8080;

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
