const path = require('path');
const express = require('express');
const app = express();
const opener = require("opener");
const portfinder = require('portfinder');


app.use(express.static(__dirname + '/dist'));

app.get('/home*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/page*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/page.html'));
});

portfinder.getPort( (err, port) => {
  app.listen(port, () => {
    console.info('[express-server]', `http://localhost:${port}/`);
    opener(`http://localhost:${port}/home`);
  });
});
