<template lang="jade">
.pageeffect-panel
  .title 系统翻页设置
  .panel-content
      .panel-row(style="position: relative")
        .title 翻页动画设置
      .panel-row.icons
        .block(v-for='(index, ani) in pageEffects', @click='setEffect(ani)')
          .icon(:style='getIconPosition(index)', :class='{seleted: effect === ani.effect}')
          .label {{ani.name}}
      .panel-row.loop
        span 播放循环设置
        dropdown.dropdown
          button.btn.btn-default(data-toggle='dropdown') {{loopName}}
            div.caret.pull-right
          ul.dropdown-menu(slot='dropdown-menu')
            li(v-for='opt in loopOptions')
              a(href='#', @click='setLoop(opt)') {{opt.name}}
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.pageeffect-panel
  .title
    height 35px
    line-height 35px
    font-size 1.6rem
    color #fff
    background-color #2d353a
    text-align center
  .panel-row
    .title
      flex 1
      text-align center
      height 30px
      line-height 30px
      color #fff
      background-color #2d353a
      border-radius 2px

    &.icons
      flex-wrap wrap
      justify-content space-between
      .label
        text-align center
      .icon
        width 78px
        height 78px
        margin auto
        background-image url(../../assets/images/pageEffect.png)
        background-size 234px 234px
        &:hover
          background-image url(../../assets/images/pageEffectHighlight.png)
      .block
        width 78px
        /*margin-bottom 10px*/
      .block:hover
        cursor pointer
      .seleted
        background-image url(../../assets/images/pageEffectHighlight.png)
        background-size 234px 234px

    &.loop
      span
        line-height 30px
    .dropdown
      .caret
        position absolute
        top 50%
        right 10px
      button
        width 100px
        height 30px
        border none
      li>a:hover
        background-color: #179eff

</style>

<script>
import '../../assets/animate.css'
import { PAGE_ANIMATION } from '../../models/animations'
import Dropdown from '../widgets/Dropdown.vue'

export default {
  name: 'pageeffect-panel',
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      pageEffects: PAGE_ANIMATION,
      loopOptions: [{
        name: '循环',
        value: true
      }, {
        name: '不循环',
        value: false
      }]
    }
  },
  computed: {
    effect() {
      return this.state.getIn(['project', '0', 'effect'])
    },
    loopName() {
      let loop =  this.state.getIn(['project', '0', 'loop'])
      return this.loopOptions.filter(item => item.value === loop)[0].name

    }
  },
  methods: {
    getIconPosition(index) {
      // 图片大小 310 * 248
      let x = -index * 78 % 234
      let y = -parseInt(index / 3) * 78
      return `background-position: ${x}px ${y}px`
    },
    setEffect(ani) {
      this.actions.setProject({
        effect: ani.effect
      })
    },
    setLoop(loop) {
      this.actions.setProject({
        loop: loop.value
      })
    },
  },
  components: {
    'dropdown': Dropdown
  }
}
</script>
