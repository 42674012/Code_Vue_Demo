<template lang="jade">
.canvas-toolbar
  .toolbar-btn(@click='alignTop')
    i.iconfont.icon-dingduiqi
  .toolbar-btn(@click='alignMiddle')
    i.iconfont.icon-zhongxinduiqi
  .toolbar-btn(@click='alignBottom')
    i.iconfont.icon-icon-bottomalgin
  .toolbar-btn(@click='alignLeft')
    i.iconfont.icon-icon-leftalgin
  .toolbar-btn(@click='alignCenter')
    i.iconfont.icon-juzhongduiqi
  .toolbar-btn(@click='alignRight')
    i.iconfont.icon-icon-rightalgin

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"
.canvas-toolbar
  position absolute
  display flex
  flex-direction column
  width 45px
  height 300px
  top 20px
  left -45px
  z-index 2

  .toolbar-btn
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
import {
   groupAlignTop,
   groupAlignBottom,
   groupAlignMiddle,
   groupAlignLeft,
   groupAlignRight,
   groupAlignCenter
} from '../../helpers/group'

export default {
	name: 'canvas-toolbar',
  mixins: [elementHelper],
	props: ['state', 'actions', 'showgrid'],
  computed: {
  },
	methods: {
    alignTop() {
      groupAlignTop(this.state, this.actions)
    },
    alignBottom() {
      groupAlignBottom(this.state, this.actions)
    },
    alignMiddle() {
      groupAlignMiddle(this.state, this.actions)
    },
    alignLeft() {
      groupAlignLeft(this.state, this.actions)
    },
    alignRight() {
      groupAlignRight(this.state, this.actions)
    },
    alignCenter() {
      groupAlignCenter(this.state, this.actions)
    }
	},
	components: {
	}
}
</script>
