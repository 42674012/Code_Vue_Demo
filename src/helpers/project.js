import config from '../config'
import denormalize from './denormalize'
import fetch from 'isomorphic-fetch'
import {
  getToken,
  getProjectId
} from './common'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'


function checkstatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    let error = new Error(res.statusText)
    error.response = res
    throw error
  }
}

function genProjectJson(state) {
  let projectJson = JSON.stringify(denormalize(state))
  let preProjectJson = state.getIn(['editorStatus', 'projectJson'])
  if (preProjectJson && preProjectJson === projectJson) {
    console.info('项目没有更改')
    return false
  }
  return projectJson
}

function genPayload(state) {
  let content = denormalize(state)
  let pid = getProjectId()
  let activeWebpage = state.getIn(['editorStatus', 'activeWebpage']).toJS()
  let payload = {
    webpageid: activeWebpage.id,
    webpagename: activeWebpage.name,
    context: JSON.stringify(content.pages[0])
  }
  return payload
}

// 保存项目
export function save(state, actions, pl) {
  // 是否是复制页面后的隐式保存
  let isDupSave = !!pl
  let projectJson = genProjectJson(state)

  if (!projectJson && !isDupSave) { // 项目数据没有更改
    toastr.success('项目没有更改', '', {
      positionClass: 'toast-top-center',
      timeOut: 800
    })
    return Promise.resolve(true)
  }

  let payload = genPayload(state)
  if (isDupSave) {
    payload.webpageid = pl.pageid
    payload.webpagename = pl.pagename
  }
  // let pid = getProjectId()
  let updateProjectUrl = `${config.apiHost}/BuilderWebpageDraft/updateDraftPage/${getToken()}`
  return fetch(updateProjectUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // credentials: 'include',
      body: JSON.stringify(payload)
    })
    .then(checkstatus)
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        if (!isDupSave) {
          toastr.success('保存成功', '', {
            positionClass: 'toast-top-center',
            timeOut: 800
          })
          actions.setProjectJson({projectJson})
        }
      } else {
        toastr.error('保存失败', '', {
          positionClass: 'toast-top-center',
          timeOut: 1000
        })
      }
      return data
    })
    .catch(e => {
      console.error(e)
      toastr.error('保存失败')
    })
}

// 发布项目
export function publish(state) {
  let payload = genPayload(state)
  let pid = getProjectId()
  let publishProjectUrl = `${config.apiHost}/project/online/${pid}`
  return fetch(publishProjectUrl, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    .then(checkstatus)
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        toastr.success(data.result, '', {
          positionClass: 'toast-top-center',
          timeOut: 800
        })
      } else {
        toastr.error(data.result, '', {
          positionClass: 'toast-top-center',
          timeOut: 1000
        })
      }
    })
    .catch(e => {
      console.error(e)
      toastr.error('发布失败')
    })
}
