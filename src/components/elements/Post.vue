<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      .post-element
        .slides(v-show="toutuOn")
          img(:src="posts.length ? posts[0].coverurl : '' | ossCrop 320")
          .desc-bar
          .desc
            .title {{posts[0] ? posts[0].title : ''}} 
            .dots
              .dot(v-for="_ in toutuCount")
        .posts
          .post-wrap(v-for="p in listPosts")
            .thumb
              img(:src='p.coverurl + "@50h|0-0-75-50a"')
            .post
              .title(:class='{single: digest, double: !digest}')
                span {{p.title}}
              .content(:class='{single: !digest, double: digest}') {{digest ? p.summary : ''}}
              .date {{p.btime | date}}
        .more(v-show="posts.length >= 3") 点击加载更多
    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='selectedElementId === elementid')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.outer-element
  position absolute
  width 100%
  height 100%
  
  .slides
    position relative
    height 180px
    background-color grey
    img
      width 320px
      height 180px
    .desc-bar
      position absolute
      bottom 0
      width 100%
      height 30px
      background-color #000
      opacity 0.4
    .desc
      position absolute
      bottom 0
      width 100%
      height 30px
      .title 
        display inline-block
        width 210px
        color #fff
        line-height 30px
        overflow hidden 
        text-overflow ellipsis
        white-space nowrap
      .dots
        float right
        width 100px
        .dot
          float right
          width 6px
          height 6px
          border-radius 3px
          line-height 30px
          margin-top 13px
          margin-right 10px
          background #ccc 


  .posts
    width 100%
    background-color #fff
    .post-wrap
      position relative
      padding 10px 6px
      height 100px
      border-bottom 1px solid #c4c4c4
      .thumb
        width 75px
        height 75px
        img
          width 100% 
      .post
        position absolute 
        left 89px 
        top 10px 
        right 10px
        line-height 20px
        .title
          color #000
          font-size 15px
          font-weight bold
          width 100%
          overflow hidden 
          text-overflow ellipsis
          // white-space nowrap
          display -webkit-box
          -webkit-box-orient vertical
          &.single
            height 20px
            -webkit-line-clamp 1
          &.double
            -webkit-line-clamp 2
            height 40px
        .content
          color #000
          font-size 14px
          width 100%
          overflow hidden 
          text-overflow ellipsis
          display -webkit-box
          -webkit-box-orient vertical
          // white-space nowrap
          &.single
            height 20px
            -webkit-line-clamp 1
          &.double
            height 40px
            -webkit-line-clamp 2
        .date
          color #999999
          position relative 
          text-align right

          

  .more
    width 100%
    height 30px
    line-height 30px
    color #979696
    background-color #e5e5e5
    text-align center
    


</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import Operate from './Operate.vue'
import fetch from 'isomorphic-fetch'
import { getToken, getProjectId } from '../../helpers/common'
import config from '../../config'


export default {
  name: 'post-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  events: {
    // ANIMATE_SHOW: 'playAnimate'
  },
  data() {
    return {
      posts: []
    }
  },
  computed: {
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    columnid() {
      return this.element.getIn(['column', 'id'])
    },
    toutuOn() {
      return this.element.getIn(['toutu', 'toggle'])
    },
    outerStyle() {
      return {
        height: this.px(this.element.get('h'))
      }
    },
    digest() {
      return this.element.get('digest')
    },
    toutuCount() {
      return this.element.getIn(['toutu', 'count'])
    },
    listPosts() {
      if (!this.toutuOn) {
        return this.posts.slice(0, 3)
      } else {
        return this.posts.slice(this.toutuCount, this.toutuCount + 3)
      }
    }
  },
  methods: {
    // playAnimate(){
    //   let vm = this
    //   this.animateShow(vm)
    // }
  },
  watch: {
    columnid(nv, ov) {
      if (nv) {
        fetch(`${config.apiHost}/builderArticle/getOnlineArticleBycolumnid/${getToken()}/${nv}/0/10`)
          .then(res => res.json())
          .then(res => {
            this.posts = res.data.dataList
          })
      }
    }
  },
  components: {
    'wrapper-element': WrapperElement,
    'operate': Operate
  },
  ready() {
    let columnid = this.element.getIn(['column', 'id'])

    if (columnid) {
      fetch(`${config.apiHost}/builderArticle/getOnlineArticleBycolumnid/${getToken()}/${columnid}/0/10`)
        .then(res => res.json())
        .then(res => {
          this.posts = res.data.dataList
          console.debug(this.posts)
        })
    }

  }
}
</script>
