<template lang="jade">
.canvas-sidebar(:style='sidebarStyle')
  .sidebar-btn(@click='toggleUndo')
    i.iconfont.icon-fanhui
  .sidebar-btn(@click='toggleRedo')
    i.iconfont.icon-forward
  .sidebar-btn(@click='togglePagePreview')
    i.iconfont.icon-eye
  .sidebar-btn(@click='toggleBgPanel', :class='{active: isBgPanelOn}')
    i.iconfont.icon-edit
  .sidebar-btn(@click='toggleGrid')
    i.iconfont.icon-set
  .sidebar-btn(@click='duplicatePage')
    i.iconfont.icon-copy

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"
.canvas-sidebar
  position absolute
  display flex
  flex-direction column
  width 100px
  height 200px
  z-index 2

  .sidebar-btn
    flex 1
    text-align center
    color #747373
    &:hover
      color #179ffe
    cursor pointer
    i
      font-size 2rem

    &.active
      color #179ffe



</style>

<script>
import config from '../../config'
import elementHelper from '../../mixins/elementHelper'

export default {
	name: 'canvas-sidebar',
  mixins: [elementHelper],
	props: ['state', 'actions', 'showgrid'],
  computed: {
    sidebarStyle() {
      return {
        left: '50%',
        top: '50%',
        marginLeft: this.px(config.canvasWidth / 2),
        marginTop: this.px(-160)
      }
    },
    isBgPanelOn() {
      return this.state.getIn(['editorStatus', 'controlPanel', 'type']) === 'bg-panel'
    }
  },
	methods: {
    toggleUndo() {
      this.actions.undo()
    },
    toggleRedo() {
      this.actions.redo()
    },
    toggleBgPanel() {
      this.actions.selectElement(-1)
    },
    duplicatePage() {
      // let slugid = this.state.getIn(['editorStatus', 'slugId'])
      // let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
      // let pageidx = this.state.getIn(['project', '0', 'pages']).indexOf(pageid)
      // console.log(pageidx)
      // let page = this.state.getIn(['pages', pageid+''])
      // let elements = page.get('elements').map(id => {
      //   return this.state.getIn(['elements', id + ''])
      // })
      // let pageData = page.update('elements', () => elements).toJS()
      // console.log(pageData)
      // this.actions.addPage(pageData, pageidx + 1, slugid, true)
      this.$dispatch('DUPLICATE_PAGE', {page: true})
    },
    toggleAnimation() {
      this.$dispatch('ANIMATE_SHOW')
    },
    togglePagePreview() {
      this.$dispatch('SHOW_PAGE_PREVIEW')
    },
    toggleGrid() {
      this.showgrid = !this.showgrid
    }
	},
	components: {
	}
}
</script>
