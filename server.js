const path        = require('path');
const express     = require('express');
const compression = require('compression');
const opener      = require('opener');
const portfinder  = require('portfinder');
const minimist    = require('minimist');

let env           = minimist(process.argv.slice(2)).env;
const app         = express();
const cache       = { maxAge: '7d' };

try {
  env = { production: env.production === true || env.production === 'true' };
} catch (e) {
  env = { production: false };
}

const router = express.Router();
router.use(compression());
let staticFolder;
let rootFolder;

if (env.production) {
  // Production Release
  staticFolder = '/dist';
  rootFolder = '/dist/';
} else {
  // Development
  staticFolder = '/src/assets';
  rootFolder = '/src/tmp/';
}

// 靜態檔案root目錄
router.use(express.static(path.join(__dirname, staticFolder), cache));

// 動態設定等同下面結果
router.get('/base*', (req, res) => {
  res.sendFile(path.join(__dirname, rootFolder, 'base.html'));
});
router.get('/page*', (req, res) => {
  res.sendFile(path.join(__dirname, rootFolder, 'page.html'));
});

if (env.production) {
  portfinder.getPort((err, port) => {
    app.use(router);
    app.use(compression());
    app.listen(port, () => {
      console.info('[express-server]', `http://localhost:${port}/`);
      opener(`http://localhost:${port}/base`);
    });
  });
}


module.exports = router;
