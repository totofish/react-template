import React, { Component ,PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

// Main navigation
export class Crumbs extends Component {

  constructor() {
    super()
  }


  renderCrumbs() {
    let tags = [];
    let routers = this.props.routeData;
    let pathLink = ''

    let pathname = _.remove(this.props.pathname.split('/'), (n) => n !== '')

    tags = pathname.map((path, index) => {
      for(let i=0, j = routers.length; i < j; i++) {
        if(routers[i].path === path) {
          pathLink += `${index > 0 ? '/' : ''}${routers[i].path}`
          const obj = { path:pathLink, tagName:routers[i].tagName }
          routers = routers[i].childRoutes || []
          return obj
        } else if(i === j-1) {
          return ''
        }
      }
    })

    _.remove(tags, (n) => n === '')

    return tags.map((item, index) => {
      let last = index === tags.length -1
      return (
        <li key={index} className="crumbs__item">
          <p className={`crumbs__link${last ? ' crumbs__link--strong' : ''}`} onClick={this.link.bind(this, item.path)}>{ item.tagName }</p>
          { last ? null : <i className="material-icons crumbs__arrow">&#xE315;</i> }
        </li>
      )
    })
  }

  link(path) {
    this.context.router.push(path)
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


Crumbs.contextTypes  = {
  router: PropTypes.object.isRequired
}

Crumbs.propTypes = {}

Crumbs.defaultProps = {}


export default connect(
  state => ({
    routeData: state.routeData
  }),
  dispatch => bindActionCreators({

  }, dispatch)
)(Crumbs)
