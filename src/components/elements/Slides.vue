<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element
      div(v-if='slidesCount === 0', style="width: 100%; height: 100%; background-color: #eee") 未添加轮播图
      img(v-else, :src='slide.get("url")', :style='style')
      .bar(v-if='slide && text')
      .text(v-if='slide && text')
        span {{slide.get('text')}}
      .dots(v-if='slidesCount && dots')
        .dot(v-for='s in slides.toJS()', :class='{active: $index === activeSlide}')


    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='selectedElementId === elementid')

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
  
  .bar
  .text
    position absolute
    width 100%
    height 40px
    left 0px
    bottom 0px
    padding-right 30%
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
  
  .bar
    background-color #000
    opacity 0.4

  .text
    margin-left 5px
    color #fff
    line-height 40px
  
  .dots
    display flex
    justify-content flex-end
    align-items center
    position absolute
    bottom 0px
    width 100%
    height 40px
    .dot
      flex 0 0 6px
      height 6px
      border-radius 3px
      margin-right 5px
      background-color #000
      &.active
        background-color #fff


</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import Operate from './OperateSlides.vue'
import { imgHost } from '../../config'

export default {
  name: 'slides-element',
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

    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    activeSlide() {
      return this.element.get('active')
    },
    slidesCount() {
      return this.element.get('slides').size
    },
    slide() {
      // return this.slidesCount > 0 ? this.element.getIn(['slides', this.activeSlide + '']) : undefined
      return this.element.getIn(['slides', this.activeSlide + ''])
    },
    slides() {
      return this.element.get('slides')
    },
    text() {
      return this.element.get('text')
    },
    dots() {
      return this.element.get('dots')
    },
    style() {
      // return this.slide ? {
      //   top: this.px(this.slide.get('it')),
      //   left: this.px(this.slide.get('il')),
      //   width: this.px(this.slide.get('iw'))
      // } : {}
      return {
        top: this.px(this.slide.get('it')),
        left: this.px(this.slide.get('il')),
        width: this.px(this.slide.get('iw'))
      }
    }
    // cropData() {
    //   return this.element.get('crop').toJS()
    // },
    // width() {
    //   return this.element.get('w')
    // },
    // croppingPic() {
    //   return this.state.getIn(['editorStatus', 'croppingPic'])
    // }
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
    // croppingPic(nv, ov) {
    //   if (nv.get('id') === this.elementid) {
    //     this.showCrop = true
    //   } else if (ov && ov.get('id') === this.elementid && nv.get('source') === 'panel') {
    //     this.$refs.crop.confirm()
    //   } else {
    //     this.showCrop = false
    //   }
    // }
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
