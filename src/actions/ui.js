import { SET_ELEMENT_PREVIEW, setElementPreview } from './element'

export const TOGGLE_TEMPLATE_LIB = 'TOGGLE_TEMPLATE_LIB'
export function toggleTemplateLib(on) {
  return {
    type: TOGGLE_TEMPLATE_LIB,
    json: {
      value: on
    }
  }
}

export const TOGGLE_CONTROL_PANEL = 'TOGGLE_CONTROL_PANEL'
export function toggleControlPanel(panel) {
  return {
    type: TOGGLE_CONTROL_PANEL,
    json: {
      type: panel.type,
      changingBg: panel.changingBg,
      changingImg: panel.changingImg,
      changingEraser: panel.changingEraser,
      changingLComparison: panel.changingLComparison,
      changingRComparison: panel.changingRComparison,
      changingShape: panel.changingShape,
      changingSlide: panel.changingSlide
    }
  }
}

export const SET_MUSIC_CONTROL = 'SET_MUSIC_CONTROL'
export function setMusicControl(musicCtrl) {
  return {
    type: SET_MUSIC_CONTROL,
    json: {
      playingMusic: musicCtrl.playingMusic,
      isMusicOn: musicCtrl.isMusicOn
    }
  }
}

export const TOGGLE_GRID_SHOW = 'TOGGLE_GRID_SHOW'
export function toggleGridShow() {
  return {
    type: TOGGLE_GRID_SHOW
  }
}

export const SET_VIEWPORT_SCALE = 'SET_VIEWPORT_SCALE'
export function setViewportScale(scale) {
  return {
    type: SET_VIEWPORT_SCALE,
    json: {
      scale
    }
  }
}

export const SET_CROPPING_PIC = 'SET_CROPPING_PIC'
export function setCroppingPic(payload) {
  return {
    type: SET_CROPPING_PIC,
    payload
  }
}

/*export const TOGGLE_GRID_LINE = 'TOGGLE_GRID_LINE'
export function toggleGridline() {
  return {
    type: TOGGLE_GRID_LINE
  }
}*/

export const SET_CANVAS_HEIGHT = 'SET_CANVAS_HEIGHT'
export function setCanvasHeight(payload) {
  return {
    type: SET_CANVAS_HEIGHT,
    payload
  }
}

export const SET_CANVAS_HEIGHT_UNDOABLE = 'SET_CANVAS_HEIGHT_UNDOABLE'
export function setCanvasHeightUndoable(payload) {
  return {
    type: SET_CANVAS_HEIGHT_UNDOABLE,
    payload
  }
}
