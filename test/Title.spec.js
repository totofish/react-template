import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Title from '@/components/Title';

const routes =[
  {
    path     : '',
    component: '',
    routes   : [
      {
        tagName  : 'Home : Page',
        path     : `/home/page`,
        component: '',
        routes   : [
          {
            tagName  : 'Info',
            path     : `/home/page/info`,
            component: ''
          }, {
            path     : `/home/page/`,
            component: ''
          }
        ]
      }
    ]
  }
]
const store = createStore(
  () => ({
    sys:{
      info: {message: 'Info Message'}
    },
    routeData: routes
  })
)

describe('Title.js', function() {
  it('<Title /> Info Message是否正確', function() {
    const wrapper = mount(
      <Provider store={store}>
        <Title />
      </Provider>
    );
    expect(wrapper.find('.scene__msg').text()).equal('Info Message');
  });

  it('測試麵包屑第2節點是否正確', function() {
    const titleDom = mount(
      <Provider store={store}>
        <Title jump="/home/page" history={[]} pathname="/home/page/info" />
      </Provider>
    );
    expect(titleDom.find('li').at(1).text()).equal('Info');
  })
});
