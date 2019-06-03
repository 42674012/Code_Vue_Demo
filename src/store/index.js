import createStoreDev from './store.dev'
import createStoreProd from './store.prod'

if (process.env.NODE_ENV === 'production') {
  export default createStoreProd
} else {
  export default createStoreDev
}
