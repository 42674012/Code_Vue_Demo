import Immutable from 'immutable'
import {
  createReducer
}
from 'redux-immutablejs'

import * as ActionTypes from '../actions/data.js'
import * as PageAction from '../actions/page.js'
import * as ElementAction from '../actions/element.js'
import * as ProjectAction from '../actions/project.js'
import * as UiAction from '../actions/ui.js'

import getPanel from '../helpers/panelMap.js'

const initialState = Immutable.fromJS({
  isFetching: true,
  selectedPageId: 1,
  selectedElementId: -1,
  selectedElements: [],
  slugId: undefined,
  gridShow: false,
  controlPanel: {type: 'bg-panel'},
  musicCtrl: {
    playingMusic: null,
    isMusicOn: false
  },
  canvasHeight: 540,
  activeWebpage: null
})

export default createReducer(initialState, {
  // [ActionTypes.RECIEVE_SITE_DATA]: (editorStatus, action) => {
  //   return editorStatus.merge({
  //     isFetching: false
  //   })
  // },

  [ActionTypes.REQUEST_JSON]: (editorStatus, action) => {
    return editorStatus.merge({
      isFetching: true
    })
  },

  [ActionTypes.RECIEVE_JSON]: (editorStatus, action) => {
    return editorStatus.merge({
      isFetching: false,
      slugId: action.payload.genSlug
    })
  },

  [ProjectAction.SET_PROJECT_INFO]: (editorStatus, action) => {
    return editorStatus.merge({
      projectThumb: action.payload.thumb,
      projectTitle: action.payload.title,
      projectContent: action.payload.content,
      projectFunctionId: action.payload.functionid,
      projectIndustryId: action.payload.industryid
    })
  },

  [ProjectAction.SET_PROJECT_JSON]: (editorStatus, action) => {
    return editorStatus.merge({
      projectJson: action.payload.projectJson,
    })
  },


  [PageAction.SELECT_PAGE]: (editorStatus, action) => {
    return editorStatus.merge({
      selectedPageId: action.json.id,
      selectedElementId: -1,
      previewElement: undefined,
      controlPanel: {type: 'bg-panel'}
    })
  },

  [PageAction.ADD_PAGE]: (editorStatus, action) => {
    let data = {
      slugId: action.json.slugId,
      selectedPageId: action.json.pageId,
      selectedElementId: -1,
      showTemplateLib: true
    }
    if (action.json.copy) {
      data.showTemplateLib = false
    }
    return editorStatus.merge(data)
  },

  [PageAction.DELETE_PAGE]: (editorStatus, action) => {
    let pageIdx = action.json.pagesIdList.indexOf(action.json.pageId)
    let nextPageId = action.json.pageId
    if (action.json.pagesIdList.length > 1) {
      if (pageIdx === action.json.pagesIdList.length - 1) { //删除最后一页
        nextPageId = action.json.pagesIdList[pageIdx - 1]
      } else {
        nextPageId = action.json.pagesIdList[pageIdx + 1]
      }
    }
    if (action.json.pageId == editorStatus.get('selectedPageId')) {
      return editorStatus.merge({
        selectedPageId: nextPageId,
        selectedElementId: undefined
      })
    } else {
      return editorStatus
    }
  },

  [ElementAction.SELECT_ELEMENT]: (editorStatus, action) => {
    let element = action.json.element
    if (element) { // 选择非背景的元素
      let type = element.get('type')
      let panel = getPanel(type)
      return editorStatus.merge({
        selectedElementId: action.json.id,
        selectedElements: [action.json.id],
        controlPanel: {type: panel},
        previewElement: undefined,
        showTemplateLib: false
      })
    } else if (action.json.id === -1) { // 选择背景
      return editorStatus.merge({
        controlPanel: {type: 'bg-panel'},
        selectedElementId: -1,
        selectedElements: [],
        previewElement: undefined,
        showTemplateLib: false
      })
    } else if (action.json.id === -2) { // 选择音乐
      return editorStatus.merge({
        controlPanel: {type: 'music-panel'},
        selectedElementId: -2,
        selectedElements: [],
        previewElement: undefined,
        showTemplateLib: false
      })
    } else if (action.json.id === -3) { // 翻页设置
      return editorStatus.merge({
        controlPanel: {type: 'pageeffect-panel'},
        selectedElements: [],
        selectedElementId: -3
      })

    }
  },

  [ElementAction.SELECT_ELEMENTS]: (editorStatus, action) => {
    let selectedElements = editorStatus.get('selectedElements')
    let checkIndex = selectedElements.indexOf(action.json.id)
    if (checkIndex > -1) selectedElements = selectedElements.delete(checkIndex)
    else selectedElements = selectedElements.push(action.json.id)

    return editorStatus.merge({
      selectedElements
    })

  },

  [ElementAction.ADD_ELEMENT]: (editorStatus, action) => {
    let id = action.json.elementId
    let element = action.json.data[id]
    if (element) { // 选择非背景的元素

      let panel = getPanel(element.type);

      return editorStatus.merge({
        slugId: action.json.slugId,
        selectedElementId: action.json.elementId,
        controlPanel: {type: panel},
        previewElement: undefined
      })
    }
  },

  [ElementAction.SET_ELEMENT_PREVIEW]: (editorStatus, action) => {
    return editorStatus.merge({
      previewElement: action.json.element
    })
  },

  [ElementAction.DELETE_ELEMENT]: (editorStatus, action) => {
    return editorStatus.merge({
      selectedElementId: undefined,
      controlPanel: {type: 'bg-panel'}
    })
  },

  [ElementAction.COPY_ELEMENT]: (editorStatus, action) => {
    return editorStatus.merge({
      copiedElement: action.json.element
    })
  },

  // UI related status
  [UiAction.TOGGLE_TEMPLATE_LIB]: (editorStatus, action) => {
    let showTemplateLib = editorStatus.get('showTemplateLib')
    return editorStatus.merge({
      showTemplateLib: action.json.value
    })
  },

  [UiAction.TOGGLE_CONTROL_PANEL]: (editorStatus, action) => {
    return editorStatus.mergeDeep({
      controlPanel: action.json,
      // selectedElementId: undefined,
      previewElement: undefined
    })
  },

  [UiAction.TOGGLE_GRID_SHOW]: (editorStatus, action) => {
    return editorStatus.mergeDeep({
      gridShow: !editorStatus.get('gridShow')
    })
  },

  [UiAction.SET_MUSIC_CONTROL]: (editorStatus, action) => {
    return editorStatus.merge({
      musicCtrl: action.json
    })
  },

  [UiAction.SET_VIEWPORT_SCALE]: (editorStatus, action) => {
    return editorStatus.merge({
      viewportScale: action.json.scale
    })
  },

  [UiAction.SET_CROPPING_PIC]: (editorStatus, action) => {
    return editorStatus.merge({
      croppingPic: {
        id: action.payload.id,
        source: action.payload.source
      }
    })
  },

  /*[UiAction.TOGGLE_GRID_LINE]: (editorStatus, action) => {
    return editorStatus.merge({
      showGridline: !editorStatus.get('showGridline')
    })
  }*/

  [UiAction.SET_CANVAS_HEIGHT]: (editorStatus, action) => {
    return editorStatus.merge({
      canvasHeight: action.payload
    })
  },
  
  
  [PageAction.SET_ACTIVE_WEBPAGE]: (editorStatus, action) => {
    return editorStatus.merge({
      activeWebpage: action.payload
    })
  }

})
