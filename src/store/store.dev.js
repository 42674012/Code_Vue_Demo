import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
// import diffLogger from 'redux-diff-logger';
import diffLogger from '../helpers/difflogger.js';
import rootReducer from '../reducers'

const finalCreateStore = applyMiddleware(
  thunk,
  diffLogger({
    transformer(state) {
      return state['undoWrapper']['present'].toJS()
    }
  }),
  createLogger({
    collapsed: true,
    stateTransformer(state) {
      return state['undoWrapper']['present'].toJS()
    }
  })
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
