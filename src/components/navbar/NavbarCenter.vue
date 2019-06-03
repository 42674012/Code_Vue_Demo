<template lang="jade">
.navbar-c
  .navbar-c-btns
    .navbar-c-btn(@click='addTextElement')
      i.iconfont.icon-font
      span 文字
    .navbar-c-btn(@click='togglePicLib("ADD_PIC")')
      i.iconfont.icon-image
      span 图片
    .navbar-c-btn(@click='togglePicLib("ADD_SLIDES")')
      i.iconfont.icon-layer
      span 图集
    .navbar-c-btn(@click='toggleShapeLib("ADD_SHAPE")')
      i.iconfont.icon-shape
      span 形状
    //
      .navbar-c-btn
        i.iconfont.icon-mutual
        span 互动
    //
      .navbar-c-btn(@click='toggleFormLib()')
    .navbar-c-btn(@click='addFormElement()')
      i.iconfont.icon-form
      span 表单
  .navbar-c-menu
    .menu
      .menu-item(@click='toggleMusic', :class='{active: elementid === -2}')
        span
          i.iconfont.icon-music
        span 背景音乐
      .menu-item(@click='togglePageEffect', :class='{active: elementid === -3}')
        span
          i.iconfont.icon-arrow-up-down
        span 翻页动画
      //
        .menu-item
          span
            i.iconfont.icon-magic
          span 特效
  piclib(:state='state', :actions='actions', :scenario='scenario', :show.sync='showPicLib')
  shapelib(:state='state', :actions='actions', :scenario='scenario', :show.sync='showShapeLib')
  formlib(:state='state', :actions='actions', :show.sync='showFormLib')

</template>

<style lang="stylus" scoped>

.navbar-c
  display flex
  position absolute
  left 300px
  right 300px
  height 100%
  color #fff

  .navbar-c-btns
    display flex
    min-width 160px
    justify-content flex-end
    flex 7
  .navbar-c-btn
    max-width 60px
    flex 1
    cursor pointer
    &:hover
      color #179ffe
    i
      display block
      text-align center
      margin-top 10px
      font-size 2rem
    span
      font-size 1.3rem
      display block
      text-align center

  .navbar-c-menu
    display flex
    align-items center
    justify-content center
    flex 5
    .menu
      display flex
      flex 1
      height 30px
      max-width 300px
      min-width 220px
      border-radius 20px
      vertical-align middle
      background-color #3e464c
      .menu-item
        flex 1
        text-align center
        border-radius 20px
        cursor pointer
        &:hover
        &.active
          background-color #179ffe
        span
          line-height 30px
</style>

<script>
import PicLib from './PicLib.vue'
import FormLib from './FormLib.vue'
import ShapeLib from './ShapeLib.vue'
import {TEXT_MODEL, FORM_MODEL, SHAPE_MODEL}from '../../models/data'



export default {
  name: 'navbar-center',
  props: ['state', 'actions'],
  data() {
    return {
      showPicLib: false,
      showShapeLib: false,
      showFormLib: false,
      scenario: ''
    }
  },
  computed: {
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    },
    pageid() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    elementid() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    }
  },
  events: {
    'SHOW_PICLIB': function (payload) {
      this.scenario = payload && payload.scenario
      this.showPicLib = true
    },
    'SHOW_SHAPELIB': function (payload) {
      this.scenario = payload && payload.scenario
      this.showShapeLib = true
    }
  },
  methods: {
    toggleMusic() {
      this.actions.selectElement(-2)
    },
    togglePicLib(scenario) {
      this.scenario = scenario
      this.showPicLib = true
    },
    toggleShapeLib(scenario) {
      this.scenario = scenario
      this.showShapeLib = true
    },
    // 暂不使用表单选择弹窗
    toggleFormLib() {
      this.showFormLib = true
    },
    togglePageEffect() {
      this.actions.selectElement(-3)
    },
    addTextElement() {
      this.actions.addElement(TEXT_MODEL, this.pageid, this.slugid)
    },
    addFormElement() {
      let id = new Date().getTime()
      FORM_MODEL.id = id++
      FORM_MODEL.lists.forEach(list => {
        list.id = 'id' + id++
      })
      this.actions.addElement(FORM_MODEL, this.pageid, this.slugid)
    },
    cancel() {
      this.showPicLib = false
    }
  },
  components: {
    piclib: PicLib,
    formlib: FormLib,
    shapelib: ShapeLib
  }
}
</script>
