import {
  Schema, arrayOf, normalize
}
from 'normalizr'
import { toggleControlPanel, toggleTemplateLib } from './ui'
import patchJson from '../helpers/patchJson'

export const ADD_PAGE = 'ADD_PAGE'
export function addPage(pageData, pageIndex, slugId, copy) {
  function normalizePage(pageData, slugId) {
    let id = slugId;

    function genSlug(entity) {
      return id++;
    }
    const elementSchema = new Schema('elements', {
      idAttribute: genSlug
    })

    const pageSchema = new Schema('pages', {
      idAttribute: genSlug
    })

    pageSchema.define({
      elements: arrayOf(elementSchema)
    })

    let resultData = normalize(pageData, pageSchema)
    return {
      pageData: patchJson(resultData),
      slugId: id
    }
  }
  let result = normalizePage(pageData, slugId)

  return dispatch => {
    // dispatch(toggleTemplateLib(true))
    dispatch({
      type: ADD_PAGE,
      json: {
        pageId: slugId,
        pageData: result.pageData,
        slugId: result.slugId,
        pageIndex: pageIndex,
        copy: copy
      }
    })
  }

  // return {
  //   type: ADD_PAGE,
  //   json: {
  //     pageId: slugId,
  //     pageData: result.pageData,
  //     slugId: result.slugId,
  //     pageIndex: pageIndex
  //   }
  // }
}

export const DELETE_PAGE = 'DELETE_PAGE'
export function deletePage(pageId, pagesIdList, elementsIdList) {

  return {
    type: DELETE_PAGE,
    json: {
      pageId,
      pagesIdList,
      elementsIdList
    }
  }
}

export const REORDER_PAGE = 'REORDER_PAGE'
export function reorderPage(fromIndex, toIndex) {
  return {
    type: REORDER_PAGE,
    json: {
      // pageId: pageId,
      fromIndex: fromIndex,
      toIndex: toIndex
    }
  }
}


export const SELECT_PAGE = 'SELECT_PAGE'
export function selectPage(id) {
  return {
    type: SELECT_PAGE,
    json: {id}
  }
}

export const SET_PAGE = 'SET_PAGE'
export function setPage(id, page) {
  return {
    type: SET_PAGE,
    json: {
      id,
      page
    }
  }
}

export const SET_PAGE_UNDOABLE = 'SET_PAGE_UNDOABLE'
export function setPageUndoable(id, page) {
  return {
    type: SET_PAGE_UNDOABLE,
    json: {
      id,
      page
    }
  }
}


export const SET_PAGE_PROPERTY = 'SET_PAGE_PROPERTY'
export function setPageProperty(pageId, pageProperty, value) {

  let jsonTem = {}
  jsonTem[pageProperty] = value

  function getPageId(entity) {
    return pageId
  }

  const propertySchema = new Schema('property', {
    idAttribute: getPageId
  })

  let propertyData = normalize(jsonTem, propertySchema)

  return {
    type: SET_PAGE_PROPERTY,
    json: {
      propertyData: propertyData.entities.property
    }
  }
}


export const SET_ACTIVE_WEBPAGE = 'SET_ACTIVE_WEBPAGE'
export function setActiveWebpage(node) {
  return {
    type: SET_ACTIVE_WEBPAGE,
    payload: node
  }
}