export function getGroupPosition(state) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
    .map(eid => {
      let el = state.getIn(['elements', eid+''])
      return el.merge({id: eid})
    })

  let left = Infinity, top = Infinity, bottom = -Infinity, right = -Infinity 


  elements.forEach(el => {
    // 文字组件高度特殊处理
    let h = el.get('h') ? el.get('h') : document.querySelector(`[slugid="${el.get('id')}"]`).offsetHeight
    if (el.get('l') < left) left = el.get('l')
    if (el.get('t') < top) top = el.get('t')
    if (el.get('l') + el.get('w') > right) right = el.get('l') + el.get('w')
    if (el.get('t') + h > bottom) bottom = el.get('t') + h 
    return true
  })
  console.debug(left, top, right, bottom)

  return {
    left,
    top,
    right,
    bottom
  }
}


export function groupAlignTop(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  elements.forEach(eid => {
    actions.setElementUndoable(eid, {
      t: position.top  
    })
    return true
  })
}

export function groupAlignBottom(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  elements.forEach(eid => {
    let el = state.getIn(['elements', eid+''])
    let h = el.get('h') ? el.get('h') : document.querySelector(`[slugid="${eid}"]`).offsetHeight
    actions.setElementUndoable(eid, {
      t: position.bottom - h
    })
    return true
  })
}

export function groupAlignMiddle(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  let middle = position.top + (position.bottom - position.top) / 2
  elements.forEach(eid => {
    let el = state.getIn(['elements', eid+''])
    let h = el.get('h') ? el.get('h') : document.querySelector(`[slugid="${eid}"]`).offsetHeight
    actions.setElementUndoable(eid, {
      t: middle - h / 2
    })
    return true
  })
}


export function groupAlignLeft(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  elements.forEach(eid => {
    actions.setElementUndoable(eid, {
      l: position.left  
    })
    return true
  })
}

export function groupAlignRight(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  elements.forEach(eid => {
    let el = state.getIn(['elements', eid+''])
    actions.setElementUndoable(eid, {
      l: position.right - el.get('w')
    })
    return true
  })
}

export function groupAlignCenter(state, actions) {
  let elements = state.getIn(['editorStatus', 'selectedElements'])
  let position = getGroupPosition(state)
  let center = position.left + (position.right - position.left) / 2
  elements.forEach(eid => {
    let el = state.getIn(['elements', eid+''])
    actions.setElementUndoable(eid, {
      l: center - el.get('w') / 2
    })
    return true
  })
}
