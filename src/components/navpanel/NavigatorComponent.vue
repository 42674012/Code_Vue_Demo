<template lang="jade">
.navigator-component
  .panel-content
    .components-row
      .component-wrapper(@click='addTextElement')
        .component
          i.iconfont.icon-wenzi
        .label 文字
      .component-wrapper(@click='togglePicLib("ADD_PIC")')
        .component
          i.iconfont.icon-tupian
        .label 图片
      .component-wrapper
        .component
          i.iconfont.icon-lunbozutu(@click='toggleSlides("ADD_SLIDES")')
        .label 轮播图
      .component-wrapper(@click='toggleShapeLib("ADD_SHAPE")')
        .component
          i.iconfont.icon-jihegeometric12
        .label 形状
    .components-row
      .component-wrapper(@click='addPostElement')
        .component
          i.iconfont.icon-liebiao
        .label 文章列表
      .component-wrapper(@click='addFormElement')
        .component
          i.iconfont.icon-biao
        .label 表单
      .component-wrapper(@click='addHeaderElement')
        .component
          i.iconfont.icon-biaoti
        .label 页面标题
      .component-wrapper(@click='addFooterElement')
        .component
          i.iconfont.icon-dibucaidan
        .label 底部菜单 

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.navigator-component
  .panel-content
    padding 20px
  
  .components-row
    display flex
    display -webkit-flex
    justify-content space-between
    margin-bottom 10px

    
  .component-wrapper
    flex 1
    position relative
    max-width 60px
    height 80px
    &:hover
      cursor pointer
      .component
        .iconfont
          color #0385f3
    
    .component
      width 60px
      height 60px
      background-color #1a212e 
      text-align center
      line-height 60px
      .iconfont
        color #fff
        font-size 34px
    

    .label
      text-align center
      color #fff
    
    
    // adhoc for non-completed components
    &.no
      &:hover
        cursor auto 
      .component
        background-color transparent

  
    
</style>

<script>

import {
  TEXT_MODEL,
  FORM_MODEL,
  SHAPE_MODEL,
  POST_MODEL,
  SLIDES_MODEL,
  HEADER_MODEL,
  FOOTER_MODEL
} from '../../models/data'

export default {
  name: 'navigator-component',
  props: ['state', 'actions'],
  data() {
    return {
    }
  },
  computed: {
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    },
    pageid() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    // pageIds() {
    //   return this.state.getIn(['project', '0', 'pages']).toArray()
    // },
    // pages() {
    //   return this.state.get('pages')
    // },
    // showTempalateLib() {
    //   return this.state.getIn(['editorStatus', 'showTemplateLib'])
    // },
    // slugid() {
    //   return this.state.getIn(['editorStatus', 'slugId'])
    // }
  },
  methods: {
    addTextElement() {
      this.actions.addElement(TEXT_MODEL, this.pageid, this.slugid)
    },
    togglePicLib(scenario) {
      this.$dispatch('SHOW_PICLIB', {scenario: scenario})
    },
    toggleShapeLib(scenario) {
      this.$dispatch('SHOW_SHAPELIB', {scenario: scenario})
    },
    toggleSlides(scenario) {
      this.$dispatch('SHOW_PICLIB', {scenario})
    },
    addPostElement() {
      this.actions.addElement(POST_MODEL, this.pageid, this.slugid)
    },
    addFormElement() {
      this.actions.addElement(FORM_MODEL, this.pageid, this.slugid)
    },
    addHeaderElement() {
      this.actions.addElement(HEADER_MODEL, this.pageid, this.slugid)
    },
    addFooterElement() {
      this.actions.addElement(FOOTER_MODEL, this.pageid, this.slugid)
    }
  },
  components: {
  },
  ready() {
  }
}
</script>
