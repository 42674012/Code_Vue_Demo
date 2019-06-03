import Immutable from 'immutable'
import { createReducer } from 'redux-immutablejs'
import * as ActionTypes from '../actions/data.js'
import * as PageAction from '../actions/page.js'
import * as ElementAction from '../actions/element.js'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.RECIEVE_JSON]: (pages, action) =>  pages.merge(action.payload.entities.pages), 

  [PageAction.ADD_PAGE]:(pages, action) => {
  	return pages.merge(action.json.pageData.entities.pages)
  },

  [PageAction.DELETE_PAGE]:(pages, action) => {
    if (action.json.pagesIdList.length <= 1) { // 只剩一页不删除
      return pages
    } else {
      return pages.filter(function(value, key){
        return (parseInt(key) !== action.json.pageId)
      })
    }
  },

  [ElementAction.ADD_ELEMENT]: (pages, action) => {
    let pageId = action.json.pageId + ""
    return pages.updateIn([pageId,'elements'], list => list.push(action.json.elementId))
  },

  [ElementAction.DELETE_ELEMENT] : (pages, action) => {
    let pageId = action.json.pageId + ''
    let elementIndex = pages.getIn([pageId,'elements']).indexOf(action.json.elementId)

    return pages.updateIn([pageId,'elements'], list => list.splice(elementIndex, 1))
  },

  [PageAction.SET_PAGE]: (pages, action) => {
    let id = action.json.id + ''
    return pages.mergeDeepIn([id], action.json.page)
  },

  [PageAction.SET_PAGE_UNDOABLE]: (pages, action) => {
    let id = action.json.id + ''
    return pages.mergeDeepIn([id], action.json.page)
  },

  [PageAction.SET_PAGE_PROPERTY]: (pages, action) => {
    return pages.mergeDeep(action.json.propertyData)
  },

  [ElementAction.REORDER_ELEMENT]: (pages, action) => {
    let pageId = action.json.pageId.toString()
    let fromIndex = pages.getIn([pageId,'elements']).indexOf(action.json.elementId)
    let toIndex = action.json.toIndex

    if(fromIndex === toIndex){
      console.debug('same positon!');
      return pages
    }

    if(toIndex >= pages.getIn([pageId,'elements']).count()){
      toIndex = pages.getIn([pageId,'elements']).count() - 1
    }
    if(toIndex < 0){
      toIndex = 0;
    }

    if(fromIndex > toIndex){
      fromIndex = fromIndex + 1
    }
    else{
      toIndex = toIndex + 1
    }

    return pages.updateIn([pageId,'elements'], list => list.splice(toIndex, 0, action.json.elementId).splice(fromIndex, 1))
  }
})
