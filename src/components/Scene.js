import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { html } from 'react-libs';
import Title from '@/components/Title';

// 如要內嵌img
// var img = require("url!assets/images/file.png")
// console.info(img)

@connect(
  state => ({
    routeData: state.routeData,
  }),
  dispatch => bindActionCreators({

  }, dispatch),
)
export default class Scene extends Component {
  constructor(props) {
    super(props);
    this.searchRoute = this.searchRoute.bind(this);
  }

  searchRoute(routeData, path) {
    let route;
    for (let i = 0, j = routeData.length; i < j; i += 1) {
      if (routeData[i].path === path) return routeData[i];
      if (routeData[i].routes) route = this.searchRoute(routeData[i].routes, path);
      if (route) return route;
    }
    return false;
  }

  render() {
    const { redirect, jumpTo, location, match, history, routeData } = this.props;
    const route = this.searchRoute(routeData, match.path);

    // Redirect
    if (redirect) {
      return (
        <div>
          <Redirect from={match.path} to={redirect} />
          <Switch>
            {
              route.routes ?
                route.routes.map(
                  routeItem => (
                    <Route
                      key={routeItem.path}
                      path={routeItem.path}
                      component={routeItem.component}
                    />
                  ),
                )
                : null
            }
          </Switch>
        </div>
      );
    }

    // Content
    return (
      <div>
        {
          location.pathname !== match.url ? null :
          <div className="scene" style={{ width: '100%', height: '100%' }}>
            <figure className="scene__bg" />
            <Title jump={jumpTo} history={history} pathname={match.path} />
            <html.CenterBox>
              <div className="scene__circle" />
              <div
                className="scene__icon"
                onClick={() => { window.location.replace('/page'); }}
                role="button"
                tabIndex="0"
              />
            </html.CenterBox>
          </div>
        }
        <Switch>
          {
            route.routes ?
            route.routes.map(
              routeItem => (
                <Route
                  key={routeItem.path}
                  path={routeItem.path}
                  component={routeItem.component}
                />
              ),
            )
            : null
          }
        </Switch>
      </div>
    );
  }
}

Scene.propTypes = {
  redirect: PropTypes.string,
  jumpTo: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  routeData: PropTypes.arrayOf(PropTypes.object),
};


Scene.defaultProps = {
  redirect: undefined,
  jumpTo: undefined,
  routeData: [],
};
