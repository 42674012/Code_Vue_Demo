import fetch from 'isomorphic-fetch'
import {
  Schema, arrayOf, normalize
}
from 'normalizr'
import patchJson from '../helpers/patchJson'
import { getProjectId, getToken } from '../helpers/common'
import config from '../config'
import { setActiveWebpage } from './page'

// TODO delete this
import { site, page } from '../models/mocksite'


export const REQUEST_JSON = 'REQUEST_JSON'
function requestJson() {
  return {
    type: REQUEST_JSON
  }
}

export const RECIEVE_JSON = 'RECIEVE_JSON'
function recieveJson(json) {
  return {
    type: RECIEVE_JSON,
    payload: json
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function fetchPageData(pageId) {
  function normalizeJSON(response) {
    let id = 0;

    function genSlug(entity) {
      return id++;
    }

    const projectSchema = new Schema('project', {
      idAttribute: genSlug
    })

    const pageSchema = new Schema('pages', {
      idAttribute: genSlug
    })

    const elementSchema = new Schema('elements', {
      idAttribute: genSlug
    })

    projectSchema.define({
      pages: arrayOf(pageSchema)
    })

    pageSchema.define({
      elements: arrayOf(elementSchema)
    })

    return response.json().then(data => {
      // console.debug(data.result)
      // let project = data.result
      // let projectContent = JSON.parse(project.projectContent)
      // projectContent.pid = project.projectID
      // projectContent.name = project.projectName
      // projectContent.industryId = project.industryID
      // projectContent.sceneId = project.sceneID
      // projectContent.tag = typeof project.projectTag  === 'Array' ? JSON.parse(project.projectTag) : []
      // projectContent.description = project.projectDescription
      // projectContent.coverUrl = project.coverUrl
      // projectContent.qrcodeUrl = project.qrcodeUrl
      // projectContent.effect = ''
      // projectContent.loop = false
      let page = data.data
      // make it consistent with h5 editor to minimize the code refactoring
      let pageContent = {
        builderprojectid: page.builderprojectid,
        pages: [JSON.parse(page.context)],
        webpageid: page.webpageid,
        webpagename: page.webpagename,
        qrcodeUrl: page.qrcodeUrl
      }

      let projectData = normalize(pageContent, projectSchema)
      projectData.genSlug = id
      return projectData
    })
  }
  
  let token = getToken()
  return dispatch => {
    return fetch(`${config.apiHost}/BuilderWebpageDraft/getDraftPageByid/${token}?webpageid=${pageId}`)
      .then(checkStatus)
      .then(normalizeJSON)
      .then(data => {
        let page = data.entities.project[0]
        let pageContent = data.entities.pages[1]
        console.debug('page data: ', pageContent) 
        dispatch(setActiveWebpage({
          id: page.webpageid,
          name: page.webpagename
        }))
        dispatch(recieveJson(data))
      })
      .catch(error => {
        console.error(`Fetch JSON failed ${error}`)
      })
  }
}


export function fetchSiteData() {
  return dispatch => {
    dispatch(requestJson())
    let token = getToken()
    let pid = getProjectId()
    return fetch(`${config.apiHost}/BuilderWebpageDraft/getPageList/${token}?builderprojectid=${pid}`)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => {
        console.debug('site data: ', data.data)
        dispatch(recieveSiteData(data.data))
        dispatch(fetchProjectData())
        dispatch(fetchPageData(data.data.lastUpdatedPageId))
      })
      .catch(error => {
        console.error(`Fetch site data failed ${error}`)
      })
  }
}

export const RECIEVE_SITE_DATA = 'RECIEVE_SITE_DATA'
function recieveSiteData(data) {
  return {
    type: RECIEVE_SITE_DATA,
    payload: data
  }
}


export function fetchProjectData() {
  return dispatch => {
    let token = getToken()
    let pid = getProjectId()
    return fetch(`${config.apiHost}/BuilderProject/getBuilderProjectByPk/${token}?projectid=${pid}`)
      .then(checkStatus)
      .then(res => res.json())
      .then(data => {
        console.debug('project data: ', data.data)
        dispatch(recieveProjectData(data.data))
      })
      .catch(error => {
        console.error(`Fetch project data failed ${error}`)
      })
  }
}

export const RECIEVE_PROJECT_DATA = 'RECIEVE_PROJECT_DATA'
function recieveProjectData(data) {
  return {
    type: RECIEVE_PROJECT_DATA,
    payload: {
      project: data
    } 
  }
}