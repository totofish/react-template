import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'

@connect(
  state => ({
    routeData: state.routeData
  }),
  dispatch => bindActionCreators({

  }, dispatch)
)
export default class Crumbs extends Component {

  constructor() {
    super()
  }

  searchRouteflow(routeData, path, tags=[]) {
    for(let i=0, j=routeData.length; i<j; i++) {
      if(routeData[i].path === path) {
        tags.push(routeData[i].tagName ? { path:routeData[i].path, tagName:routeData[i].tagName } : '')
        return tags
      }
      let nextTags = tags.concat(routeData[i].tagName ? { path:routeData[i].path, tagName:routeData[i].tagName } : '')
      if(routeData[i].routes) nextTags = this.searchRouteflow(routeData[i].routes, path, nextTags)
      if(nextTags && nextTags[nextTags.length -1].path === path) return nextTags
    }
    return false
  }

  renderCrumbs() {
    let tags = this.searchRouteflow(this.props.routeData, this.props.pathname) || []
    _.remove(tags, (n) => n === '')
    return tags.map((item, index) => {
      let last = index === tags.length -1
      return (
        <li key={index} className="crumbs__item">
          <p className={`crumbs__link${last ? ' crumbs__link--strong' : ''}`} onClick={this.link.bind(this, item.path, last)}>{ item.tagName }</p>
          { last ? null : <i className="material-icons crumbs__arrow">&#xE315;</i> }
        </li>
      )
    })
  }

  link(path, last) {
    if(!last) this.props.history.push(path)
  }

  render() {

    return (
      <div className="crumbs">
        <ol>
          { this.renderCrumbs() }
        </ol>
      </div>
    )
  }
}

Crumbs.propTypes = {}

Crumbs.defaultProps = {}