export default function(type) {
  let panel = ''

  switch (type) {
    case 'pic':
      panel = 'pic-panel'
      break
    case 'shape':
      panel = 'shape-panel'
      break
    case 'text':
      panel = 'text-panel'
      break
    case 'form':
      panel = 'form-panel'
      break
    case 'slides':
      panel = 'slides-panel'
      break
    case 'post':
      panel = 'post-panel'
      break
    case 'header':
      panel = 'header-panel'
      break
    case 'footer':
      panel = 'footer-panel'
      break
    default:
      break
  }

  return panel
}
