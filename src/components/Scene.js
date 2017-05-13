import React, { Component } from 'react'
import { html } from 'react-libs'
import Title from '@/components/Title'

// 如要內嵌img
// var img = require("url!assets/images/file.png")
// console.info(img)

export default class Scene extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        {
          this.props.children ||
          <div className="scene" style={{width:'100%', height:'100%'}}>
            <figure className="scene__bg"></figure>
            <Title jump={this.props.route.jumpTo} router={this.context.router} />
            <html.CenterBox>
              <div className="scene__circle"></div>
              <figure className="scene__icon" onClick={()=>{ location.replace('/page') }}></figure>
            </html.CenterBox>
          </div>
        }
      </div>
    )
  }
}


Scene.contextTypes = {
  router: React.PropTypes.object.isRequired
}
