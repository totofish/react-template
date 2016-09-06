const path = require('path');
const express = require('express');
const app = express();
const opener = require("opener");
const portfinder = require('portfinder');
let argv = require('minimist')(process.argv.slice(2), { boolean:['release'] });

let router = express.Router();
if(argv.release) {
  // Production Release
  router.use(express.static(__dirname + '/dist')); // 靜態檔案root目錄
  router.get('/base*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  });
  router.get('/page*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/dist/page.html'));
  });
} else {
  // Development
  router.use(express.static(__dirname + '/src/assets')); // 靜態檔案root目錄
  router.get('/base*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
  });
  router.get('/page*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/src/page.html'));
  });
}

if(argv.release) {
  portfinder.getPort( (err, port) => {
    app.use(router);
    app.listen(port, () => {
      console.info('[express-server]', `http://localhost:${port}/`);
      opener(`http://localhost:${port}/base/home`);
    });
  });
}


module.exports = router;
