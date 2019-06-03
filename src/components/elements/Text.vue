<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      .text-element.ql-editor(v-html='element.get("con")', :style='style', v-el:text)
    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')

</template>

<style lang="stylus" >
// @import '~quill/dist/quill.snow.css'
@import '../../assets/quill.css'

.outer-element
  width 100%
  height 100%
  .text-element
    p
      margin 0


</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import OuterElement from './Outer.vue'
import Operate from './Operate.vue'

export default {
  name: 'text-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  activate(done) {
    $(this.$el).find('p').css({margin: 0})
    done()
  },
  computed: {
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    outerStyle() {
      return {
        backgroundColor: this.element.get('bgcolor'),
        borderColor: this.element.get('border-color'),
        borderStyle: this.element.get('border-style'),
        borderWidth: this.element.get('border-width'),
        borderRadius: this.px(this.element.get('borderradius') * this.h / 200)
        // boxShadow: `0 0 ${this.px(this.element.get('boxshadow'))} #000`
      }
    },
    style() {
      return {
        fontFamily: 'Arial',
        color: this.element.get('color'),
        fontSize: this.px(this.element.get('size')),
        fontWeight: this.element.get('bold') ? 'bold' : 'normal',
        fontStyle: this.element.get('italic') ? 'italic' : 'normal',
        fontDecoration: this.element.get('url') ? 'underline' : 'none',
        lineHeight: this.element.get('lineheight'),
        // textAlign: this.element.get('textalign'),
        textDecoration: this.element.get('udl') ? 'underline' : 'none',
        opacity: this.element.get('opacity'),
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap'
      }
    },
    h() {
      let lines = this.$els.text.children.length
      lines = lines === 0 ? 1 : lines
      return this.element.get('size') * this.element.get('lineheight') * lines
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    }

  },
  events: {
    ANIMATE_SHOW: 'playAnimate'
  },
  methods: {
    playAnimate(){
      let vm = this
      this.animateShow(vm)
    }
  },
  components: {
    'wrapper-element': WrapperElement,
    'outer-element': OuterElement,
    'operate': Operate
  },
  ready() {
    let vm = this
    // this.animateShow(vm)
  }
}
</script>
