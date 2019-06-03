<template lang="jade">
div
  //
    .cropper-wrap(v-show='showCrop')
      img(:src='picid', :style='cropperStyle', v-el:pic)

  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      img(:src='picid', :style='style')
    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.outer-element
  position absolute
  width 100%
  height 100%
  overflow hidden

  img
    position absolute
    // max-width 100%
    -webkit-user-drag none

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import Operate from './Operate.vue'
import { imgHost } from '../../config'

export default {
  name: 'pic-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      imgHost: imgHost,
      showCrop: false,
      cropper: undefined
    }
  },
  computed: {
    style() {
      return {
        top: this.px(this.element.get('it')),
        left: this.px(this.element.get('il')),
        width: this.px(this.element.get('iw')),
        opacity: this.element.get('opacity'),
        // height: this.px(this.element.get('inh')),
      }
    },
    outerStyle() {
      return {
        // borderRadius: this.element.get('borderradius') + '%',
        borderRadius: this.px(this.element.get('borderradius') * this.element.get('h') / 200),
        boxShadow: `0 0 ${this.px(this.element.get('boxshadow'))} black`,
        transform: `rotate${this.element.get('rotate')}deg`
      }
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])

    },
    picid() {
      return this.element.get('url')
    },
    cropData() {
      return this.element.get('crop').toJS()
    },
    width() {
      return this.element.get('w')
    },
    croppingPic() {
      return this.state.getIn(['editorStatus', 'croppingPic'])
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    }
  },
  methods: {
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
  watch: {
    croppingPic(nv, ov) {
      if (nv.get('id') === this.elementid) {
        this.showCrop = true
      } else if (ov && ov.get('id') === this.elementid && nv.get('source') === 'panel') {
        this.$refs.crop.confirm()
      } else {
        this.showCrop = false
      }
    }
  },
  components: {
    'wrapper-element': WrapperElement,
    'operate': Operate
  },
  ready() {
    let vm = this
    // this.animateShow(vm)
  }
}
</script>
