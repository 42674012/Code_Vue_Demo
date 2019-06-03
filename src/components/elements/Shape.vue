<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      .shape(v-html='svg()')
    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.outer-element
  position absolute
  width 100%
  height 100%
  overflow hidden

  .shape
    width 100%
    height 100%

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import Operate from './Operate.vue'
import {SHAPE_MAP_BASIC, SHAPE_MAP_EXT} from '../../models/shapes'

export default {
  name: 'shape-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
    }
  },
  computed: {
    outerStyle() {
      return {
        transform: `rotate${this.element.get('rotate')}deg`,
      }
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    }
  },
  methods: {
    svg(){
      let svgname = this.element.get('shape')
      if (svgname) {
        let shape = SHAPE_MAP_BASIC.concat(SHAPE_MAP_EXT).filter(s => s.name === svgname)[0]

        let svg = $(`<div>${shape.value}</div>`)

        // let svgSchema = Util.getSvgColorSchema(svg.find('svg').eq(0))

        svg.find('svg')
          .attr('preserveAspectRatio', 'none meet')
          .css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: this.element.get('opacity')
          })
        // svg.find('[fill]').attr('fill', this.element.get('shapecolor'))


        let colors = this.element.get('colors').toJS()
        if (colors) {
          for(let i in colors){
             svg.find('svg').find('.' + i + '-fill').attr('fill',colors[i])
             svg.find('svg').find('.' + i + '-stroke').attr('stroke',colors[i])
          }
        }

        return svg.html()
      }
    },
    playAnimate(){
      let vm = this
      this.animateShow(vm)
    }
  },
  events: {
    'ANIMATE_SHOW': function () {
      this.playAnimate(this)
    }
  },
  components: {
    'wrapper-element': WrapperElement,
    'operate': Operate
  },
  ready() {
    let vm = this
  }
}
</script>
