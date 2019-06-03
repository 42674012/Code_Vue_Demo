import config from '../config'
import {
  getToken,
  getProjectId
} from './common'

import toastr from 'toastr'


function checkstatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    let error = new Error(res.statusText)
    error.response = res
    throw error
  }
}

// 发布项目
export function publish(state) {
  let project = state.getIn(['site', 'project']).toJS()
  let pid = getProjectId()
  let token = getToken()
  let publishProjectUrl = `${config.apiHost}/BuilderProject/saveAndOnline/${token}`
  let payload = {
      builderprojectid: pid,
      projectname: project.projectname,
      sceneid: project.sceneid,
      industryid: project.industryid,
      tags: project.tags,
      coverurl: project.coverurl,
      description: project.description
  }

  return fetch(publishProjectUrl, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    //   credentials: 'include',
    body: JSON.stringify(payload)
  })
    .then(checkstatus)
    .then(res => res.json())
    .then(data => {
      if (data.status && data.code === 200) {
        toastr.success('发布成功', '', {
          positionClass: 'toast-top-center',
          timeOut: 800
        })
      } else {
        toastr.error('发布失败', '', {
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
