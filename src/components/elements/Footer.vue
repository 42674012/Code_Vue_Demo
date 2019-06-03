<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      .wrap(v-for="menu in menus")
        .icon(:style='iconStyle')
          i.fa(:class='menu.icon')
        .label(v-if='labelOn') {{menu.label}}

    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')


</template>

<style lang="stylus" >

.outer-element
  display flex
  position relative
  width 100%

  .wrap
    position relative
    flex 1
    align-items center
    align-content content
    text-align center
    .icon
      position relative
      i
        font-size 26px

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import OuterElement from './Outer.vue'
import Operate from './Operate.vue'
import {getCropImage} from '../../helpers/common'

export default {
  name: 'footer-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    outerStyle() {
      return {
        backgroundColor: this.element.get('bgcolor'),
        color: this.element.get('fontcolor'),
        height: this.px(this.element.get('h'))
        // borderColor: this.element.get('border-color'),
        // borderStyle: this.element.get('border-style'),
        // borderWidth: this.element.get('border-width'),
        // borderRadius: this.px(this.element.get('borderradius') * this.h / 200)
        // boxShadow: `0 0 ${this.px(this.element.get('boxshadow'))} #000`
      }
    },
    labelOn() {
      return this.element.get('labelOn')
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    },
    iconStyle() {
      return {
        top: this.labelOn ? '3px' : '12px'
      }

    },
    menus() {
      return this.element.get('menus').toJS()
    }

  },
  components: {
    'wrapper-element': WrapperElement,
    'outer-element': OuterElement,
    'operate': Operate
  },
  ready() {
  }
}
</script>
