import Immutable from 'immutable'
import {
  createReducer
}
from 'redux-immutablejs'
import * as ActionTypes from '../actions'
import * as PageAction from '../actions/page.js'
import * as ProjectAction from '../actions/project.js'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {
  [ActionTypes.RECIEVE_JSON]: (project, action) => project.merge(action.payload.entities.project),

  [ProjectAction.SET_PROJECT]: (project, action) => {
    return project.mergeIn(['0'], action.payload)
  },

  [PageAction.ADD_PAGE]: (project, action) => {
    if (action.json.pageIndex !== undefined) {
      console.debug('insert a page')
      return project.updateIn(['0', 'pages'], list => list.splice(action.json.pageIndex, 0, action.json.pageId));
    } else {
      console.debug('append a page to tail')
      return project.updateIn(['0', 'pages'], list => list.push(action.json.pageId))
    }
  },

  [PageAction.DELETE_PAGE]: (project, action) => {
    if (action.json.pagesIdList.length <= 1) { // 只剩一页不删除
      return project
    } else {
      let pageArray = project.getIn(['0', 'pages']).filter(function (value, key) {
        return value !== action.json.pageId
      });
      return project.setIn(['0', 'pages'], pageArray)
    }
  },


  [PageAction.REORDER_PAGE]: (project, action) => {

    let { fromIndex, toIndex }  = action.json
    let movingPageId = project.getIn(['0', 'pages',fromIndex]);

    if (fromIndex === toIndex) {
      return project
    }

    if (toIndex >= project.getIn(['0', 'pages']).count()) {
      toIndex = project.getIn(['0', 'pages']).count() - 1
    }

    if (toIndex < 0) {
      toIndex = 0;
    }

    console.debug(`move page from ${fromIndex} to positon ${toIndex}`);

    if (fromIndex > toIndex) {
      fromIndex = fromIndex + 1
    } else {
      toIndex = toIndex + 1
    }

    return project.updateIn(['0', 'pages'], list => list.splice(toIndex, 0, movingPageId).splice(fromIndex, 1))
  },

  [ActionTypes.SET_LOOP]: (project, action) => {
    // return project.updateIn(['0', 'loop'], value => (value === 'false' || value === false) ? true : false)
    return project.updateIn(['0', 'loop'], () => action.payload)
  },

  [ActionTypes.SET_MUSIC]: (project, action) => {
    return project.updateIn(['0', 'music'], json => action.json )
  }

})
