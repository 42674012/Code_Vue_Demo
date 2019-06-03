<template lang="jade">
.wrapper-preview(:style='style')
  .pic-preview(:style='imgStyle')
    img(:src='imgsrc')

</template>

<style lang="stylus" scoped>

.wrapper-preview
  position absolute
  overflow hidden
  z-index 0

  .pic-preview
    position absolute
    img
      width 100%
      height 100%

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import {SCALE} from '../../config'


export default {
  name: 'pic-element-preview',
  mixins: [elementHelper],
  props: ['element'],
  computed: {
    imgsrc() {
      let src = this.element.get('url')
      let previewWidth = parseInt(this.element.get('w') * SCALE)
      let crop = src.match(/\.gif$/) ? '' : `@${previewWidth}w_80q.src`
      return `${src}${crop}`
    },
    style() {
      return {
        top: this.px(this.element.get('t')),
        left: this.px(this.element.get('l')),
        width: this.px(this.element.get('w')),
        height: this.px(this.element.get('h')),
        borderRadius: this.px(this.element.get('borderradius') * this.element.get('h') / 200),
        transform: this.xRotate(this.element.get('rotate'))
      }
    },
    imgStyle() {
      return {
        top: this.px(this.element.get('it')),
        left: this.px(this.element.get('il')),
        width: this.px(this.element.get('iw')),
        // height: this.px(this.element.get('inh'))
      }
    },

  }
}
</script>
