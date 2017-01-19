import EmptyPage from 'components/EmptyPage'

const indexRedirect = (path) => (nextState, replace) => replace(path)
const enterRoute = (path) => {
  return {
    onEnter: indexRedirect(path)
  }
}
const passRoute = (path) => {
  return {
    component: EmptyPage,
    indexRoute: enterRoute(path)
  }
}

module.exports = [
  {
    // home
    tagName: 'Home',
    path: 'home',
    ...passRoute('/home/page'),
    childRoutes: [{
      // home/page
      tagName: 'Page',
      path: 'page',
      jumpTo: 'home/page/info',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('components/Scene').default)
        }, 'page')
      },
      childRoutes: [{
        // home/page/info
        tagName: 'Info',
        path: 'info',
        jumpTo: 'doc',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('components/Scene').default)
          }, 'page')
        }
      }]
    }]
  }, {
    // doc
    tagName: 'Doc',
    path: 'doc',
    jumpTo: 'demo',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('components/Scene').default)
      }, 'page')
    }
  }, {
    // demo
    tagName: 'Demo',
    path: 'demo',
    jumpTo: 'demo/:value',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('components/Scene').default)
      }, 'page')
    },
    childRoutes: [{
      // demo/:value
      tagName: 'Value',
      path: ':value',
      jumpTo: 'home',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('components/Scene').default)
        }, 'page')
      }
    }]
  }
]
