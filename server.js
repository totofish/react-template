const path        = require('path')
const express     = require('express')
const compression = require('compression')
const app         = express()
const opener      = require("opener")
const portfinder  = require('portfinder')
const fs          = require('fs')
let env           = require('minimist')(process.argv.slice(2)).env
const cache       = {maxAge:'7d'}

try {
  env = { production: env.production == true || env.production == 'true' }
} catch(e) {
  env = { production: false }
}

let router = express.Router()
router.use(compression())
let staticFolder, rootFolder
if(env.production) {
  // Production Release
  staticFolder = '/dist'
  rootFolder = '/dist/'
} else {
  // Development
  staticFolder = '/src/assets'
  rootFolder = '/src/'
}

// 靜態檔案root目錄
router.use(express.static(__dirname + staticFolder, cache))
// 依照html檔名定義router
fs.readdirSync(__dirname + rootFolder).forEach(function (file) {
  if (fs.statSync(path.join(__dirname + rootFolder, file)).isFile()) {
    if(/.html$/.test(file)) {
      let fileName = file.replace(/.html$/, '')
      router.get(`/${fileName}*`, (req, res, next) => {
        res.sendFile(path.join(__dirname + rootFolder + file), cache)
      })
    }
  }
})
/*
// 動態設定等同下面結果
router.get('/base*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'base.html'))
})
router.get('/page*', (req, res, next) => {
  res.sendFile(path.join(__dirname + rootFolder + 'page.html'))
})
*/


if(env.production) {
  portfinder.getPort( (err, port) => {
    app.use(router)
    app.use(compression())
    app.listen(port, () => {
      console.info('[express-server]', `http://localhost:${port}/`)
      opener(`http://localhost:${port}/base`)
    })
  })
}


module.exports = router
