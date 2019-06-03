<template lang="jade">
.canvas-area
  canvas-viewport(:state='state', :actions='actions')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.canvas-area
  /*position absolute*/
  padding-left 320px
  height 100%
  z-index 0
  background-color #eaeded
  -webkit-user-select none
  -moz-user-select non

</style>

<script>
import CanvasViewport from './CanvasViewport.vue'
import config from '../../config'

export default {
  name: 'canvas-area',
  props: ['state', 'actions'],
  components: {
    'canvas-viewport': CanvasViewport
  },
  ready() {
    this.actions.setViewportScale(config.SCALE)
    // this.$on('WINDOW_MOUSEDOWN', (payload) => {
    //   let e = payload.event
    //   if ($(e.target).hasClass('canvas-area') ||
    //       $(e.target).hasClass('canvas-viewport')) {
    //     if (this.state.getIn(['editorStatus', 'showTemplateLib'])) {
    //       this.actions.undo()
    //     } else {
    //       this.actions.selectElement(-1)
    //     }
    //   }
    //   return true
    // })
  }
}
</script>
