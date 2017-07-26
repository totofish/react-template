import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
// import { Redirect, Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BASE_PAGE_BASENAME } from '@/constants/config';
import 'react-libs/dist/react-libs.css';
import routes from '@/routes/indexRoute';
import '@/assets/sass/styles.scss';
import Bundle from '@/components/Bundle';
/* eslint-disable import/no-extraneous-dependencies, import/no-webpack-loader-syntax */
// 動態載入component
import StageComponent from 'bundle-loader?lazy&name=base-page!../components/Stage';
import PageNotFoundComponent from 'bundle-loader?lazy&name=base-page!../components/PageNotFound';
/* eslint-enable import/no-extraneous-dependencies, import/no-webpack-loader-syntax */

const Stage = (data, { ...props }) => (
  <Bundle load={StageComponent}>
    { Comp => <Comp {...data} {...props} /> }
  </Bundle>
);

const PageNotFound = ({ ...props }) => (
  <Bundle load={PageNotFoundComponent}>
    { Comp => <Comp {...props} /> }
  </Bundle>
);

export default function Base({ store }) {
  const StageView = Stage.bind(this, { routes });
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path={BASE_PAGE_BASENAME} component={StageView} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}

Base.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
