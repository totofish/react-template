import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Progress from '@/components/Progress';

export default function Stage({ routes }) {
  return (
    <div>
      <Switch>
        {
          routes.map(
            route => <Route key={route.path} path={route.path} component={route.component} />,
          )
        }
      </Switch>
      <Progress />
    </div>
  );
}

Stage.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

Stage.defaultProps = {
  routes: [],
};
