<template lang="jade">
div.page-thumb-block(@mousedown='selectPage', v-bind:class='{nohover: pageNum === -1, active: selectedPageId === pageId}')
  slot
  .page-action
    .page-up(@click='movePage(true)')
      i(v-if='pageNum > 0').iconfont.icon-arrow-up2
    .page-num(v-if='pageNum >= 0')
      span {{pageNum + 1}}
    .page-down(@click='movePage(false)')
      i(v-if='pageNum < pagesCount - 1').iconfont.icon-arrow-down2

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.page-thumb-block
  position relative
  width 100%
  height 260px

  &:hover
    .page-num
      color #179ffe

  &.active
    .page-num
      color #179ffe
    .page-action
      visibility visible

  .page-action
    position absolute
    display flex
    flex-direction column
    width 50px
    height 150px
    top 50%
    margin-top -75px

    .page-up
    .page-num
    .page-down
      display flex
      align-items center
      text-align center
      flex 1
      i, span
        flex 1
        font-size 2rem
      i
        cursor pointer
      &:hover
        color #179ffe

</style>

<script>

export default {
  name: 'page-thumb-block',
  props: ['state', 'actions', 'pageId', 'pageNum'],
  computed: {
    pagesCount() {
      return this.state.getIn(['project', '0', 'pages']).size
    },
    selectedPageId() {
      if(!this.state) return -1
      else return this.state.getIn(['editorStatus', 'selectedPageId'])
    }
  },
  methods: {
    movePage(up) {
      let target = up ? this.pageNum - 1 : this.pageNum + 1
      this.actions.reorderPage(this.pageNum, target)
    },
    selectPage(e) {
      let vm = this
      if (this.pageNum !== -1) { // do nothing on add page block
        this.actions.selectPage(this.pageId)
        this.$nextTick(function () {
          vm.$dispatch('ANIMATE_SHOW', null)
        })

      }
    }
  }
}
</script>
