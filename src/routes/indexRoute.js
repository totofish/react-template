import React, { Component } from 'react'
import { DEVELOPMENT, BASE_PAGE_BASENAME } from '@/constants/config'
import SceneComponent from 'bundle-loader?lazy&name=base-page!../components/Scene'
import Bundle from '@/components/Bundle'

const Scene = (data, { ...props }) => (
  <Bundle load={SceneComponent}>
    {(Comp) => <Comp {...data} {...props} />}
  </Bundle>
)

/**
 * React-router 4 設計特性可以不是一層一層的route接續下去
 * 所以route可以直接跳過某些層，例如有/home/page但沒有/home對應component
 * 但延伸問題是有人用網址/home進網站就會沒有component對應到，這需要另外去防堵
 * 反而要自己在可能發生的route部分去特別處理
 * 另外route的先後順序影響很大，要確保你期望的route不會被更前面的route吃掉
 * 跟執行到的順序有很大關係
 */

export default [
  {
    path     : `${BASE_PAGE_BASENAME}`,
    component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/home`}),
    routes   : [
      {
        tagName  : 'Home : Page',
        path     : `${BASE_PAGE_BASENAME}/home/page`,
        component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/home/page/info`}),
        routes   : [
          {
            tagName  : 'Info',
            path     : `${BASE_PAGE_BASENAME}/home/page/info`,
            component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/doc`})
          }, {
            // 進入 /home/page/? 導回 /home/page
            path     : `${BASE_PAGE_BASENAME}/home/page/`,
            component: Scene.bind(this, {redirect: `${BASE_PAGE_BASENAME}/home/page`})
          }
        ]
      }, {
        // 進入 /home/? 導回 /home/page
        path     : `${BASE_PAGE_BASENAME}/home`,
        component: Scene.bind(this, {redirect: `${BASE_PAGE_BASENAME}/home/page`})
      }, {
        tagName  : 'Doc',
        path     : `${BASE_PAGE_BASENAME}/doc`,
        component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/demo`})
      }, {
        tagName  : 'Demo',
        path     : `${BASE_PAGE_BASENAME}/demo`,
        component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/demo/:value`}),
        routes   : [
          {
            tagName  : 'Value',
            path     : `${BASE_PAGE_BASENAME}/demo/:value`,
            component: Scene.bind(this, {jumpTo: `${BASE_PAGE_BASENAME}/home`})
          }
        ]
      }, {
        // 進入 /? 導回 /
        path     : `${BASE_PAGE_BASENAME}/`,
        component: Scene.bind(this, {redirect: `${BASE_PAGE_BASENAME}`}),
      }
    ]
  }
]