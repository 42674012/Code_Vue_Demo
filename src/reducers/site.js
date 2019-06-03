import Immutable from 'immutable'
import { createReducer } from 'redux-immutablejs'
import * as ActionTypes from '../actions/data'
import * as SiteAction from '../actions/site'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.RECIEVE_SITE_DATA]: (site, action) => site.merge(action.payload),

  [ActionTypes.RECIEVE_PROJECT_DATA]: (site, action) => site.merge(action.payload),

  [SiteAction.SET_SITE]: (site, action) => site.mergeDeep(action.payload)

})
