#React-template [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/totofish/react-template/master/LICENSE)

使用 gulp + webpack 2 + react + react-router + react-redux 基礎workflow架構



##Usage

```shell
$ yarn install
$ yarn run cp           // copy paste其他polyfill到scripts資料夾,windows不支援這指令
$ yarn run dev          // development開發測試
$ yarn run release      // production發佈
$ yarn run addlibs      // add self git module
```

##架構特點
> 使用webpack-dev-server設置Router並使用hot熱加載作為Development階段預覽.
>
> Development & Production輸出皆會開啟瀏覽器實際運行結果(自動對應目前可用的port)
>
> 使用express node server作為Production檢查發佈結果正確性.
>
> 使用環境變數設置Production發佈正確設定.
>
> 使用gulp將Production發佈檔案整理至/dist並壓縮優化相關檔案.
>
> 使用yarn add git方式使用自製module.
>
> 使用Dynamic Routing並傳入Reducer中讓麵包屑對應單元.
>
> 使用domready啟動React render，讓等待主程式載入前空白畫面縮短(第一個頁面是動態載入的話仍會有短暫空白畫面)或不會有空白畫面.
>
> 使用react-saga設計可以取消的API Action以及一次可以發送連續Action或夾雜CallBack Function的Actions，一樣可以被取消.
>
> 其他優化流程請參考Source Code


```javascript
  this.props.dispatch({
    type: types.API_ASYNC,
    option: {
      fullUrl      : URL,
      method       : 'GET',
      contentType  : 'form',
      body         : { format: 'json' },
      Authorization: 'Bearer <token>'
    }
  })
  this.props.apiActionCancel()  // 取消當前所有未完成API Action

  this.props.multiActionCancel() // 取消前一次的multiAction
  // 發送多筆連續Action,Callback Function或Delay Action
  this.props.multiAction({
    actions: [
      () => { console.info('循環開始') },
      sysAction.delay(1000),
      getIPAction.getIP({ callback: (response) => {
        console.info('IP:', response.ip)
      }})
    ]
  })
```
