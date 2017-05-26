#React-template [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/totofish/react-template/master/LICENSE)

使用 gulp + webpack 2 + react 15.5 + react-router 4 + react-redux + redux-saga 基礎workflow架構



## Usage

```shell
$ yarn install
$ yarn run cp           // copy paste其他polyfill到scripts資料夾,windows不支援這指令
$ yarn run dev          // development開發測試
$ yarn run release      // production發佈
$ yarn run addlibs      // add self git module
```

## 架構特點
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

## 使用React-router 4
React-router 4 設計特性可以不是一層一層的route接續下去
所以route可以直接跳過某些層，例如有/home/page但沒有/home對應component
但延伸問題是有人用網址/home進網站就會沒有component對應到，這需要另外去防堵
反而要自己在可能發生的route部分去特別處理
另外route的先後順序影響很大，要確保你期望的route不會被更前面的route吃掉
跟執行到的順序有很大關係