export const SET_PROJECT = 'SET_PROJECT'
export function setProject(payload) {
  return {
    type: SET_PROJECT,
    payload
  }
}

export const SET_PROJECT_JSON = 'SET_PROJECT_JSON'
export function setProjectJson(payload) {
  return {
    type: SET_PROJECT_JSON,
    payload
  }
}

export const UNDO = 'UNDO'
export function undo() {
  return {
    type: UNDO
  }
}

export const REDO = 'REDO'
export function redo() {
  return {
    type: REDO
  }
}
