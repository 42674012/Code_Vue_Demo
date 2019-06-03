export default function (state) {
  let project = state.getIn(['project', '0']).toJS()
  let pages = state.get('pages').toJS()
  let elements = state.get('elements').toJS()
  for (let k in pages) {
    pages[k].elements = pages[k].elements.map(eid => elements[eid + ''])
  }
  project['pages'] = project['pages'].map(pid => pages[pid + ''])

  return project
}
