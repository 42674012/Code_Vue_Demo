<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle', :class='{active: state.getIn(["editorStatus", "selectedElementId"]) === elementid}')
      .inner(:style="innerStyle")
        button.btn.btn-default.submit(:style='buttonStyle') {{btnText}}
        .lists(v-for='list in lists')
          input.list(:placeholder='getPlaceHolder(list)', type='text', :style='inputStyle', @keydown.stop='')
    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.outer-element
  position absolute
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  overflow hidden
  &.active
    background-color rgba(255, 255, 255, 0.8)

  .inner
    position relative
    overflow hidden
    .list
      width 100%
      height 35px
      padding-left 10px
      margin-bottom 20px
      border 1px solid
      font-size 1.8rem

    .submit
      position absolute
      left 0px
      bottom 0px
      width 100%
      min-width 80px
      height 35px
      color #fff
      font-size 1.8rem
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import Operate from './Operate.vue'

export default {
  name: 'form-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    lists() {
      return this.element.get('lists') ? this.element.get('lists').toJS() : []
    },
    innerStyle() {
      return {
        flexBasis: this.px(this.element.get('w') * 0.7),
        width: this.px(this.element.get('w') * 0.7),
        height: this.px(this.element.get('h') * 0.7)
      }
    },
    outerStyle() {
      return {
        opacity: this.element.get('opacity')
      }
    },
    inputStyle() {
      return {
        color: this.element.get('fontcolor'),
        borderColor: this.element.get('bordercolor'),
        borderRadius: this.px(this.element.get('borderradius') * 35 / 200)
      }
    },
    buttonStyle() {
      return {
        border: 'none',
        backgroundColor: this.element.get('btncolor'),
        borderRadius: this.px(this.element.get('borderradius') * 35 / 200),
      }
    },
    btnText() {
      return this.element.get('btntext')
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    }
  },
  methods: {
    getPlaceHolder(list) {
      let ph = list.label
      if (list.required) ph += '*'
      return ph
    }

  },
  watch: {
    'element.get("fontcolor")': function (val) {
      document.styleSheets[0].addRule(`[slugid="${this.elementid}"] .list::-webkit-input-placeholder`, `color: ${val}`)
      document.styleSheets[0].insertRule(`[slugid="${this.elementid}"] .list::-webkit-input-placeholder {color: ${val}}`, 0)
    }
  },
  components: {
    'wrapper-element': WrapperElement,
    'operate': Operate
  },
  ready() {
    let fontcolor = this.element.get('fontcolor')
    document.styleSheets[0].addRule(`[slugid="${this.elementid}"] .list::-webkit-input-placeholder`, `color: ${fontcolor}`)
    document.styleSheets[0].insertRule(`[slugid="${this.elementid}"] .list::-webkit-input-placeholder {color: ${fontcolor}}`, 0)
  }
}
</script>
