<template lang="jade">
.canvas-viewport
  //
    .mask-left(:style='maskleftStyle', v-el:maskleft)
    .mask-top(:style='masktopStyle', v-el:masktop)
    .mask-right(:style='maskrightStyle', v-el:maskright)
    .mask-bottom(:style='maskbottomStyle', v-el:maskbottom)
    cropper(:state='state', :actions='actions')
  .canvas-window-wrapper
    cropper(:state='state', :actions='actions')
    .canvas-window(:style='canvasStyle')
      canvas-resize(:state='state', :actions='actions', :page='page', :pageid='pageId')
      .canvas-animation
        canvas-bg(:state='state', :actions='actions', :pageid='pageId', :page='page')
        canvas-elements(:state='state', :actions='actions', :page='page', :elements='elements')
    grid(v-show='showGrid')
  // .canvas-window-border(:style='transform')
  canvas-sidebar(:state='state', :actions='actions', :showgrid.sync='showGrid')
</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.canvas-viewport
  position relative
  height 100%

.canvas-window-wrapper
  position relative
  height 100%
  padding-top 105px
  padding-bottom 200px
  overflow scroll

  .mask-left
  .mask-top
  .mask-right
  .mask-bottom
    position absolute
    background-color #fff
    pointer-events none
    opacity 0.7
    z-index 1
  .mask-left
    top 0
    left 0
    height 100%
  .mask-right
    top 0
    height 100%
  .mask-top
    top 0
  .mask-bottom
    bottom 0



  .canvas-window
    position relative
    /*width 320px*/
    left 50%
    /*margin-left -160px*/
    margin-bottom 200px
    background-color #000
    box-shadow 0px 2px 10px 0px rgba(0,0,0,0.2)
    .canvas-animation
      position relative
      width 100%
      height 100%

  .btn
    position absolute
    left 0px
    height 50px
    font-size 1.4rem
    color $darker-font-color
    margin-top 6rem
    background-color $bg
    border-color $darker-font-color
    border-radius 0
    outline none
    z-index 2

  .confirm
    border none
    background-color $important-button-bg
    color #fff


</style>

<script>
import config from '../../config'
import { PAGE_MODEL } from '../../models/data'
import CanvasSidebar from './CanvasSidebar.vue'
import CanvasResize from './CanvasResize.vue'
import CanvasBg from './CanvasBg.vue'
import CanvasElements from './CanvasElements.vue'
import elementHelper from '../../mixins/elementHelper'
import Cropper from '../widgets/Cropper.vue'
import Grid from '../widgets/Grid.vue'
import { PAGE_ANIMATION } from '../../models/animations'
import '../../assets/pageAnimate.css'


export default {
	name: 'canvas-viewport',
  mixins: [elementHelper],
  data() {
    return {
      showGrid: false,
    }
  },
	props: ['state', 'actions'],
  computed: {
    project() {
      return this.state.getIn(['project', '0'])
    },
    slugId() {
      return this.state.getIn(['editorStatus', 'slugId'])
    },
    pageId() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    pageIndex() {
      return this.state.getIn(['project', '0', 'pages']).indexOf(this.pageId)
    },
    page() {
      return this.state.getIn(['pages', this.pageId + ''])
    },
    elements() {
      return this.state.get('elements')
    },
    previewElement() {
      let previewElement = this.state.getIn(['editorStatus', 'previewElement'])
      if (previewElement) {
        return previewElement
      } else {
        return undefined
      }
    },
    showTemplateLib() {
      return this.state.getIn(['editorStatus', 'showTemplateLib'])
    },
    canvasStyle() {
      let ch = this.state.getIn(['pages', '1', 'ch'])
      let height = ch || this.state.getIn(['editorStatus', 'canvasHeight'])
  
      return {
        width: this.px(config.canvasWidth),
        height: this.px(height),
        marginLeft: this.px(-config.canvasWidth/2)
      }
    },
    // transform() {
    //   let tx = -640 * (1 - SCALE) / 2
    //   let ty = -1008 * (1 - SCALE) / 2
    //   let w = 640 * SCALE
    //   let h = 1008 * SCALE
    //   return {
    //     'transform': `matrix(${SCALE}, 0, 0, ${SCALE}, ${tx}, ${ty})`,
    //     '-webkit-transform': `matrix(${SCALE}, 0, 0, ${SCALE}, ${tx}, ${ty})`,
    //     '-moz-transform': `matrix(${SCALE}, 0, 0, ${SCALE}, ${tx}, ${ty})`,
    //     '-ms-transform': `matrix(${SCALE}, 0, 0, ${SCALE}, ${tx}, ${ty})`,
    //     left: '50%',
    //     top: '50%',
    //     marginLeft: this.px(-w/2),
    //     marginTop: this.px(-h/2)
    //   }
    // },
    // sidebarStyle() {
    //   let tx = -640 * (1 - SCALE) / 2
    //   let ty = -1008 * (1 - SCALE) / 2
    //   let w = 640 * SCALE
    //   let h = 1008 * SCALE
    //   return {
    //     left: '50%',
    //     top: '50%',
    //     marginLeft: this.px(w/2),
    //     marginTop: this.px(-200)
    //   }
    // },
    // maskleftStyle() {
    //   return {
    //     width: this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1)
    //   }
    // },
    // masktopStyle() {
    //   return {
    //     left: this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1),
    //     width: this.px(640 * SCALE + 1),
    //     height: this.px((window.innerHeight - 60) / 2 - 1008 * SCALE / 2 + 1),
    //   }
    // },
    // maskrightStyle() {
    //   return {
    //     left: this.px((window.innerWidth - 230 - 300) / 2 + 640 * SCALE / 2 + 1),
    //     width: this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1),
    //   }
    // },
    // maskbottomStyle() {
    //   return {
    //     top: this.px((window.innerHeight - 60) / 2 + 1008 * SCALE / 2  + 1),
    //     left: this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1),
    //     width: this.px(640 * SCALE + 1),
    //   }
    // },
    gridShow() {
      return this.state.getIn(['editorStatus', 'gridShow'])
    }

  },
  events: {
    'ANIMATE_SHOW': function () {
      this.applyAnimation(this.page.get('effect'))
      this.$broadcast('ANIMATE_SHOW')
    }
  },
	methods: {
    addBlankPage(e) {
      this.actions.selectElement(-1)
      this.actions.addPage(PAGE_MODEL, this.pageIndex + 1, this.slugId)
    },
    confirm() {
      this.actions.toggleTemplateLib(false)
    },
    applyAnimation(effect) {
      let vm = this
      for (let ani of PAGE_ANIMATION) {
        if (effect === ani.effect) {
          $(this.$el).find('.canvas-animation')
          .css({zIndex: 10})
          .addClass(ani.class).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            $(vm.$el).find('.canvas-animation').removeClass(ani.class).css({zIndex: 0})
          })
          break
        }
      }
    }
	},
  watch: {
    // 'project.get("effect")': function (val) {
    //   this.applyAnimation(val)
    // },
    // 'page.get("effect")': function (val) {
    //   this.applyAnimation(val)
    // },
    // 'pageid': function () {
    //   this.applyAnimation(this.page.get('effect'))
    // }
  },
	components: {
    'canvas-sidebar': CanvasSidebar,
    'canvas-resize': CanvasResize,
    'canvas-bg': CanvasBg,
    'canvas-elements': CanvasElements,
    'cropper': Cropper,
    'grid': Grid
	},
  ready() {
    $('.canvas-window-wrapper').niceScroll({
      cursorcolor: '#5a6267',
      cursorborder: '0px',
      cursorwidth: 5,
      // railpadding: {right: 5},
      autohidemode: false,
      horizrailenabled: false,
      railpadding: {top: 0, right: 40, left: 0, bottom: 0}
    })
  //   window.onresize = () => {
  //     this.$els.maskleft.style.width = this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1)

  //     this.$els.maskright.style.left = this.px((window.innerWidth - 230 - 300) / 2 + 640 * SCALE / 2 + 1)
  //     this.$els.maskright.style.width = this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1)

  //     this.$els.masktop.style.left = this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1)
  //     this.$els.masktop.style.height = this.px((window.innerHeight - 60) / 2 - 1008 * SCALE / 2 + 1)

  //     this.$els.maskbottom.style.top = this.px((window.innerHeight - 60) / 2 + 1008 * SCALE / 2  + 1)
  //     this.$els.maskbottom.style.left = this.px((window.innerWidth - 230 - 300) / 2 -  640 * SCALE / 2 + 1)
  //   }
  }

}
</script>
