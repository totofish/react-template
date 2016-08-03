import React, { Component } from 'react';
import Title from 'components/view/Title';
import { html } from 'libs';

// 如要內嵌img
// var img = require("url!assets/image/file.png");
// console.info(img);

export default class Scene extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="scene" style={{width:'100%', height:'100%'}}>
        <figure className="scene__bg"></figure>
        <Title text={this.props.location.pathname} jump={this.props.route.jump} router={this.context.router} />
        <html.CenterBox>
          <div className="scene__circle"></div>
          <figure className="scene__icon" onClick={()=>{ location.replace('/page') }}></figure>
        </html.CenterBox>
      </div>
    );
  };
};


Scene.contextTypes = {
  router: React.PropTypes.object.isRequired
};
