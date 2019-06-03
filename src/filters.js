import Vue from 'vue'

Vue.filter('percentage', value => {
  return `${Math.round(value * 100)}%`
})

Vue.filter('seconds', value => {
  return `${(value / 1000).toFixed(1)}s`
})

Vue.filter('px', value => {
  return `${value}px`
})
Vue.filter('deg', value => {
  return `${value}度`
})


Vue.filter('ossCrop', (path, cropW, cropH) => {
  let croppedImg
  if (cropW && cropH) {
    croppedImg = `${path}@${cropW}w_${cropH}h.src`
  } else if (cropW) {
    croppedImg = `${path}@${cropW}w.src`
  } else if (cropH) {
    croppedImg = `${path}@${cropH}h.src`
  }

  return croppedImg
})

Vue.filter('date', value => {
  const monthMap = {
    1: '01',
    2: '02',
    3: '03',
    4: '04',
    5: '05',
    6: '06',
    7: '07',
    8: '08',
    9: '09',
    10: '10',
    11: '11',
    12: '12'
  }
  let date = new Date(value)

  return `${date.getFullYear()}-${monthMap[date.getMonth()+1]}-${date.getDate()}` 

})
