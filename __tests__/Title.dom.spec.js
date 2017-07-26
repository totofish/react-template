import React from 'react';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Title from '@/components/Title.js';
import { createBrowserHistory } from 'history'; // eslint-disable-line import/no-extraneous-dependencies


const history = createBrowserHistory();

const routes = [
  {
    path: '',
    component: '',
    routes: [
      {
        tagName: 'Home : Page',
        path: '/home/page',
        component: '',
        routes: [
          {
            tagName: 'Info',
            path: '/home/page/info',
            component: '',
          }, {
            path: '/home/page/',
            component: '',
          },
        ],
      },
    ],
  },
];

const store = createStore(
  () => ({
    sys: {
      info: { message: 'Info Message' },
    },
    routeData: routes,
  }),
);

describe('Title.js', () => {
  it('<Title /> Info Message是否正確', () => {
    const titleDom = mount(
      <Provider store={store}>
        <Title />
      </Provider>,
    );
    expect(titleDom.find('.scene__msg').text()).toEqual('Info Message');
  });

  it('測試麵包屑第2節點是否正確', () => {
    const titleDom = mount(
      <Provider store={store}>
        <Title jump="/home/page" history={history} pathname="/home/page/info" />
      </Provider>,
    );
    expect(titleDom.find('li').at(1).text()).toEqual('Info');
  });
});
