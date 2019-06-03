<template lang="jade">
.wrapper-preview(:style='wrapperStyle')
  .shape-preivew-svg(v-html='svg')

</template>

<style lang="stylus" scoped>

.wrapper-preview
  position absolute

  .shape-preivew
    width 100%
    height 100%

  .shape-preivew-svg
    width 100%
    height 100%


</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import { SHAPE_MAP_BASIC, SHAPE_MAP_EXT } from '../../models/shapes'


export default {
  name: 'shape-element-preview',
  mixins: [elementHelper],
  data() {
    return {
    }
  },
  props: ['element'],
  computed: {
    wrapperStyle() {
      return {
        top: this.px(this.element.get('t')),
        left: this.px(this.element.get('l')),
        width: this.px(this.element.get('w')),
        height: this.px(this.element.get('h')),
        minHeight: this.element.get('h') === 0 ? '0px' : '5px',
        minWidth: this.element.get('w') === 0 ? '0px' : '5px'
      }
    },
    style() {
      return {
        opacity: this.element.get('opacity'),
        transform: this.xRotate(this.element.get('rotate')),
      }
    },
    svg() {
      let svgname = this.element.get('shape')
      if (svgname) {
        let shape = SHAPE_MAP_BASIC.concat(SHAPE_MAP_EXT).filter(s => s.name === svgname)[0]
        let svg = $(`<div>${shape.value}</div>`)
        svg.find('svg')
          .attr('preserveAspectRatio', 'none meet')
          .css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.element.get('opacity'),
            transform: this.xRotate(this.element.get('rotate'))
          })

        let colors = this.element.get('colors').toJS()
        if (colors) {
          for(let i in colors){
             svg.find('svg').find('.' + i + '-fill').attr('fill',colors[i])
             svg.find('svg').find('.' + i + '-stroke').attr('stroke',colors[i])
          }
        }
        return svg.html()
      }
      return undefined
    }
  }
}
</script>
