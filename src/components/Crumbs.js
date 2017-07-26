import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

@connect(
  state => ({
    routeData: state.routeData,
  }),
  dispatch => bindActionCreators({

  }, dispatch),
)
export default class Crumbs extends Component {
  searchRouteflow(routeData, path, tags = []) {
    for (let i = 0, j = routeData.length; i < j; i += 1) {
      if (routeData[i].path === path) {
        tags.push(routeData[i].tagName ? { path: routeData[i].path, tagName: routeData[i].tagName } : '');
        return tags;
      }
      let nextTags = tags.concat(routeData[i].tagName ? { path: routeData[i].path, tagName: routeData[i].tagName } : '');
      if (routeData[i].routes) nextTags = this.searchRouteflow(routeData[i].routes, path, nextTags);
      if (nextTags && nextTags[nextTags.length - 1].path === path) return nextTags;
    }
    return false;
  }

  link(path, last) {
    if (!last) this.props.history.push(path);
  }

  renderCrumbs() {
    const tags = this.searchRouteflow(this.props.routeData, this.props.pathname) || [];
    _.remove(tags, n => n === '');
    return tags.map((item, index) => {
      const last = index === tags.length - 1;
      this.link = this.link.bind(this, item.path, last);
      return (
        <li key={item.path} className="crumbs__item">
          <div
            className={`crumbs__link${last ? ' crumbs__link--strong' : ''}`}
            onClick={this.link}
            role="button"
            tabIndex={index + 1}
          >{ item.tagName }</div>
          { last ? null : <i className="material-icons crumbs__arrow">&#xE315;</i> }
        </li>
      );
    });
  }

  render() {
    return (
      <div className="crumbs">
        <ol>
          { this.renderCrumbs() }
        </ol>
      </div>
    );
  }
}

Crumbs.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  pathname: PropTypes.string.isRequired,
  routeData: PropTypes.arrayOf(PropTypes.object),
};

Crumbs.defaultProps = {
  routeData: [],
};
