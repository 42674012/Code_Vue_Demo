<template lang="jade">
.wrapper-preview(:style='style')
  .slides-preview(:style='imgStyle')
    img(:src='imgsrc')

</template>

<style lang="stylus" scoped>

.wrapper-preview
  position absolute
  overflow hidden
  z-index 0

  .slides-preview
    position absolute
    img
      width 100%
      height 100%

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import {SCALE} from '../../config'


export default {
  name: 'slides-element-preview',
  mixins: [elementHelper],
  props: ['element'],
  computed: {
    imgsrc() {
      let slides = this.element.get('slides')
      let active = this.element.get('active')
      let src = slides.getIn([active + '', 'url'])
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
      }
    },
    imgStyle() {
      let slides = this.element.get('slides')
      let active = this.element.get('active')
      let slide = slides.get(active)

      return {
        top: this.px(slide.get('it')),
        left: this.px(slide.get('il')),
        width: this.px(slide.get('iw')),
        // height: this.px(this.element.get('inh'))
      }
    },

  }
}
</script>
