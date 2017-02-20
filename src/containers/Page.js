import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import 'assets/sass/styles'
import Title from 'components/Title'
import { html } from 'react-libs'
import 'react-libs/dist/react-libs.css'
import Progress from 'components/Progress'

const { CenterBox } = html

export default class Page extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <div className="scene" style={{width:'100%', height:'100%'}}>
          <figure className="scene__bg"></figure>
          <Title text="Page" />
          <CenterBox>
            <div className="scene__circle scene__circle--black"></div>
            <figure className="scene__icon" onClick={()=>{ location.replace('/base') }}></figure>
          </CenterBox>
          <Progress />
        </div>
      </Provider>
    )
  }
}

Page.propTypes = {
  store: PropTypes.object.isRequired
}
