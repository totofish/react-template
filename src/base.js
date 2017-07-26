import 'babel-polyfill';
import 'fetch-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import domready from 'domready';
import * as types from '@/constants/actionTypes';
import rootSaga from '@/sagas/rootSaga';
import { DEVELOPMENT } from '@/constants/config';
import routes from '@/routes/indexRoute';
import Base from '@/containers/Base';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
if (process.env.NODE_ENV === DEVELOPMENT) {
  middlewares.push(createLogger());
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer);
sagaMiddleware.run(rootSaga);

store.dispatch({
  type: types.ROUTE_DATA,
  routes,
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root'),
  );
};

domready(() => {
  render(Base);
});

/* eslint-disable global-require */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index');
    store.replaceReducer(nextRootReducer);
  });
  module.hot.accept();
  // 下面這種方式感覺載入模塊拆分複雜時會無效
  // module.hot.accept('./containers/Base', () => {
  //   const NewRoot = require('./containers/Base').default
  //   render(NewRoot)
  // })
}
/* eslint-enable global-require */
