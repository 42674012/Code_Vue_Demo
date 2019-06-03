import Immutable from 'immutable'
import { createReducer } from 'redux-immutablejs'
import * as ActionTypes from '../actions'
import * as PageAction from '../actions/page.js'
import * as ElementAction from '../actions/element.js'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

	[ActionTypes.RECIEVE_JSON]: (elements, action) => {
		return elements.merge(action.payload.entities.elements)
	},

	[PageAction.ADD_PAGE]: (elements, action) => {
		return elements.merge(action.json.pageData.entities.elements)
	},

	[PageAction.DELETE_PAGE]: (elements, action) => {
		if (action.json.pagesIdList.length <= 1) { // 只剩一页不删除
      return elements
    } else {
			return elements.filter(function(value, key) {
				return (action.json.elementsIdList.indexOf(parseInt(key)) < 0 )
			})
		}
	},

	[ElementAction.ADD_ELEMENT]: (elements, action) => {
		return elements.mergeDeep(action.json.data)
	},

	[ElementAction.DELETE_ELEMENT] : (elements, action) => {
		return elements.filter(function(value, key) {
			return parseInt(key) !== action.json.elementId
		})
	},

	[ElementAction.SET_ELEMENT]: (elements, action) => {
		let id = action.json.id + ''
		return elements.mergeDeepIn([id], action.json.element)
	},

	[ElementAction.SET_ELEMENT_UNDOABLE]: (elements, action) => {
		let id = action.json.id + ''
		return elements.mergeDeepIn([id], action.json.element)
	}

})
