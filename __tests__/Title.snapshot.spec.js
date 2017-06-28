import React from 'react'
import renderer from 'react-test-renderer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Title from '@/components/Title.js'

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

describe('Title.js', () => {
  it('<Title />', () => {
    const component = renderer.create(
      <Provider store={store}>
        <Title />
      </Provider>
    )
    let snapshot = component.toJSON()
    expect(snapshot).toMatchSnapshot()
  })

  it('<Title jump="/home/page" history={[]} pathname="/home/page/info" />', () => {
    const component = renderer.create(
      <Provider store={store}>
        <Title jump="/home/page" history={[]} pathname="/home/page/info" />
      </Provider>
    )
    let snapshot = component.toJSON()
    expect(snapshot).toMatchSnapshot()
  })
})
