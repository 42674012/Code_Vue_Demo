<template lang="jade">
div.page-navigator
  .pages-list
    ul.sortable
      li(v-for='pageId in pageIds')
        page-thumb-block(:state='state', :actions='actions', :page-id='pageId', :page-num='$index')
          page-thumb(:state='state', :actions='actions', :page-id='pageId')
  .add-page(@click='addPage()')
    span +

  // template-lib(v-if='showTempalateLib', :state='state', :actions='actions')

</template>

<style lang="stylus">
@import "../../variables.styl"

.page-navigator
  position absolute
  width 230px
  height 100%
  background-color #3e464c

  .mask
    position absolute
    width 100%
    height 100%
    background-color $mask-bg
    pointer-events none
    opacity 0.5
    z-index 100

  .bar
    position absolute
    top 0px
    left 0px
    width 161px
    height 40px
    text-align center
    line-height 40px
    background-color $pagenav-bg
    border-right 1px solid $grid-border-color
    border-bottom 1px solid $grid-border-color
    z-index 101

  .pages-list
    position absolute
    top 0px
    left 0px
    width 230px
    bottom 68px
    /*overflow-y auto*/
    overflow-x hidden
    z-index 101

  .add-page
    position absolute
    width 100%
    height 68px
    bottom 0px
    color #179ff3
    font-size 4rem
    font-weight bold
    background-color #2d353b
    cursor pointer
    span
      display block
      line-height 68px
      text-align center


  .page-navigator-toggle
    display none
    @media screen and (max-width: $screen-xs-max)
      display block

ul
  list-style none
  margin 0
  padding 0

  .sortable-placeholder
    width 100%
    height 180px
    background-color $grid-border-color

</style>

<script>
import PageThumbBlock from './PageThumbBlock.vue'
import PageThumb from './PageThumb.vue'
import { PAGE_MODEL } from '../../models/data.js'
// import TemplateLib from './TemplateLib.vue'
//
export default {
  name: 'page-navigator-area',
  props: ['state', 'actions'],
  data() {
    return {
    }
  },
  computed: {
    pageIds() {
      return this.state.getIn(['project', '0', 'pages']).toArray()
    },
    pages() {
      return this.state.get('pages')
    },
    showTempalateLib() {
      return this.state.getIn(['editorStatus', 'showTemplateLib'])
    },
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    }
  },
  methods: {
    addPage() {
      this.actions.selectElement(-1)
      this.actions.addPage(PAGE_MODEL, undefined, this.slugid)
    }
  },
  components: {
    'page-thumb-block': PageThumbBlock,
    'page-thumb': PageThumb,
    // 'template-lib': TemplateLib
  },

  ready() {
    let el = $(this.$el).find('.pages-list')
    el.niceScroll({
      cursorcolor: '#5a6267',
      cursorborder: '0px',
      cursorwidth: 5,
      railpadding: {right: 5},
      autohidemode: false,
      horizrailenabled: false
    })
    // this.$on('WINDOW_MOUSEDOWN', (payload) => {
    //   let e = payload.event
    //   if ($(e.target).hasClass('page-navigator')) {
    //     if (this.state.getIn(['editorStatus', 'showTemplateLib'])) {
    //       this.actions.undo()
    //     } else {
    //       this.actions.selectElement(-1)
    //     }
    //   }
    // })
  },
  destroyed() {
    $(this.$el).find('.pages-list').getNiceScroll().remove()
  }
}
</script>
