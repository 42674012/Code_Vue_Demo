import * as dataActions from './data.js'
import * as projectActions from './project.js'
import * as pageActions from './page.js'
import * as elementActions from './element.js'
import * as uiActions from './ui.js'
import * as siteActions from './site.js'

export default Object.assign({},
  dataActions,
  projectActions,
  pageActions,
  elementActions,
  uiActions,
  siteActions
)
