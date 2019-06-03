import {
  Schema, normalize
}
from 'normalizr'
import { toggleControlPanel } from './ui'

export const ADD_ELEMENT = 'ADD_ELEMENT'
function normalizeElement(elementData, slugId) {
  let id = slugId
  function genSlug(entity) {
    return id++;
  }
  const elementSchema = new Schema('elements', {
    idAttribute: genSlug
  })
  let projectData = normalize(elementData, elementSchema)

  return {
    data: projectData.entities.elements,
    slugId: id
  }
}

export function addElement(elementData, pageId, slugId) {
  let result = normalizeElement(elementData, slugId)
  return {
    type: ADD_ELEMENT,
    json: {
      slugId: result.slugId,
      pageId: pageId,
      data: result.data,
      elementId: slugId
    }
  }
}

// export function addElement(elementData, pageId, slugId) {

//   function normalizeElement(elementData, slugId) {

//     let id = slugId

//     function genSlug(entity) {
//       return id++;
//     }

//     const elementSchema = new Schema('elements', {
//       idAttribute: genSlug
//     })

//     let projectData = normalize(elementData, elementSchema)

//     return {
//       data: projectData.entities.elements,
//       slugId: id
//     }

//   }

//   let result = normalizeElement(elementData, slugId)

//   return {
//     type: ADD_ELEMENT,
//     json: {
//       slugId: result.slugId,
//       pageId: pageId,
//       data: result.data,
//       elementId: slugId
//     }
//   }
// }

export const SELECT_ELEMENT = 'SELECT_ELEMENT'
export function selectElement(id, element) {
  return {
    type: SELECT_ELEMENT,
    json: {
      id,
      element
    }
  }
}

export const SELECT_ELEMENTS = 'SELECT_ELEMENTS'
export function selectElements(id, element) {
  return {
    type: SELECT_ELEMENTS,
    json: {
      id,
      element
    }
  }
}

export const DELETE_ELEMENT = 'DELETE_ELEMENT'
export function deleteElement(elementId, pageId) {
  return {
    type: DELETE_ELEMENT,
    json: {
      pageId: pageId,
      elementId: elementId
    }
  }
}

export const SET_ELEMENT = 'SET_ELEMENT'
export function setElement(id, element) {
  return {
    type: SET_ELEMENT,
    json: {
      id,
      element
    }
  }
}

export const SET_ELEMENT_UNDOABLE = 'SET_ELEMENT_UNDOABLE'
export function setElementUndoable(id, element) {
  return {
    type: SET_ELEMENT_UNDOABLE,
    json: {
      id,
      element
    }
  }
}

export const SET_ELEMENT_PROPERTY = 'SET_ELEMENT_PROPERTY'
export function setElementProperty(elementId, elementProperty, value) {
  let jsonTem = {}
  jsonTem[elementProperty] = value

  function getElementId(entity) {
    return elementId
  }

  const propertySchema = new Schema('property', {
    idAttribute: getElementId
  })

  let propertyData = normalize(jsonTem, propertySchema)


  return {
    type: SET_ELEMENT_PROPERTY,
    json: {
      propertyData: propertyData.entities.property
    }
  }
}

export const REORDER_ELEMENT = 'REORDER_ELEMENT'
export function reorderElement(pageId, elementId, toIndex) {
  return {
    type: REORDER_ELEMENT,
    json: {
      pageId: pageId,
      elementId: elementId,
      toIndex: toIndex
    }
  }
}

export const COPY_ELEMENT = 'COPY_ELEMENT'
export function copyElement(element) {
  return {
    type: COPY_ELEMENT,
    json: {
      element
    }
  }
}

export const SET_ELEMENT_PREVIEW = 'SET_ELEMENT_PREVIEW'
export function setElementPreview(id, element) {
  return {
    type: SET_ELEMENT_PREVIEW,
    json: {
      id,
      element
    }
  }
}
