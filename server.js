const path = require('path');
const express = require('express');
const app = express();
const opener = require("opener");
const portfinder = require('portfinder');
let argv = require('minimist')(process.argv.slice(2), { boolean:['release'] });

let router = express.Router();
let staticFolder, rootFolder;
if(argv.release) {
  // Production Release
  staticFolder = '/dist';
  rootFolder = '/dist/';
} else {
  // Development
  staticFolder = '/src/assets';
  rootFolder = '/src/';
}

router.use(express.static(__dirname + staticFolder)); // 靜態檔案root目錄
router.get('/base*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'index.html'));
});
router.get('/page*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'page.html'));
});


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
