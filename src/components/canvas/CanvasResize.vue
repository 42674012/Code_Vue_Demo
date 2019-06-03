<template lang="jade">
.canvas-resize
  .canvas-resize-handler(:style='style')

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.canvas-resize
  position absolute
  width 100%
  bottom -31px

  .canvas-resize-handler
    margin auto
    width 60px
    height 60px
    border-radius 30px
    background-color #fff
    cursor pointer



</style>

<script>
import elementHelper from '../../mixins/elementHelper'

export default {
	name: 'canvas-resize',
  mixins: [elementHelper],
	props: ['state', 'actions', 'page', 'pageid'],
  computed: {
    style() {
      return {
        backgroundColor: this.page.get('bgcolor')
      }
    }
  },
	methods: {
	},
  ready() {
    let vm = this
    let initCanvasHeight
    const minHeight = 504

    $(this.$el).on('movestart', e => {
      let ch = this.page.get('ch') 
      initCanvasHeight = ch || vm.state.getIn(['editorStatus', 'canvasHeight'])
      vm.actions.setCanvasHeightUndoable(initCanvasHeight)
      vm.actions.setPageUndoable(this.pageid, { ch: initCanvasHeight })
    })

    $(this.$el).on('move', e => {
      let h = initCanvasHeight + e.distY

      if (h >= 504) {
        vm.actions.setCanvasHeight(h)
        vm.actions.setPage(this.pageid, { ch: h })
      }
    })
  }
}
</script>
