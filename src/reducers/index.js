// import * as ActionTypes from '../actions'
// import { combineReducers } from 'redux'
import {
  combineReducers as originCombineReducers
}
from 'redux'
import {
  combineReducers
}
from 'redux-immutablejs'
import undoable, {
  includeAction
}
from 'redux-undo'

import project from './project.js'
import site from './site'
import pages from './pages.js'
import elements from './elements.js'
import editorStatus from './editorStatus.js'

import * as ActionTypes from '../actions'

const undoWrapper = combineReducers({
  editorStatus,
  project,
  site,
  pages,
  elements
})

const ignoreAction = [
  ActionTypes.REQUEST_JSON,
  ActionTypes.RECIEVE_JSON,
  ActionTypes.SET_PROJECT_INFO,
  ActionTypes.FETCH_CHART_MODELS,
  ActionTypes.SET_VIEWPORT_SCALE,
  ActionTypes.SET_ELEMENT,
  ActionTypes.SET_PAGE,
  ActionTypes.SET_ELEMENT_PREVIEW,
  ActionTypes.TOGGLE_TEMPLATE_LIB,
  ActionTypes.SET_CANVAS_HEIGHT
]

const forceUndoAction = [
  ActionTypes.SET_ELEMENT_UNDOABLE,
  ActionTypes.SET_PAGE_UNDOABLE,
  ActionTypes.SET_CANVAS_HEIGHT_UNDOABLE
]

export default originCombineReducers({
  undoWrapper: undoable(undoWrapper, {
    initialState: undefined,
    undoType: ActionTypes.UNDO,
    redoType: ActionTypes.REDO,
    initTypes: ['@@redux/INIT', '@@INIT'],
    filter: (action, currentState, previousState) => {

      if (ignoreAction.indexOf(action.type) > -1) {
        return false
      }

      if (forceUndoAction.indexOf(action.type) > -1) {
        return true
      }

      return currentState !== previousState
    },
    debug: false
  })
})
