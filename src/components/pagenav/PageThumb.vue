<template lang="jade">
.page-thumb
  .page-thumb-bg(:style='colorStyle')
    img(v-if='page.get("bgpic")', :src='page.get("bgpic") | ossCrop 150', :style='imgStyle')
  .page-thumb-elements
    .page-thumb-element(v-for='id in elementsIds', :style='getStyle(id)')
      component(:is='elements.getIn([id+"", "type"]) + "-preview"',
      :element='elements.get(id+"")')
  .page-thumb-delete
  .page-thumb-delete-logo(@click.stop='deletePage')
    i.iconfont.icon-close

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.page-thumb
  position absolute
  top 1.5rem
  left 1rem
  width 640px
  height 1008px
  background #fff
  transform scale(150/640)
  margin-top -388px
  margin-left -205px

  .page-thumb-delete
    position absolute
    width 100%
    height 100px
    background-color #000
    opacity 0.6
  .page-thumb-delete-logo
    position absolute
    width 100px
    height 100px
    color #fff
    cursor pointer
    text-align center
    .icon-close
      font-size 7rem
      line-height 100px


.page-thumb-bg
  position absolute
  width 100%
  height 100%
  overflow hidden
  img
    position absolute

.page-thumb-elements
  position absolute
  width 100%
  height 100%
  overflow hidden
  .page-thumb-element
    position absolute
    width 100%
    height 100%



</style>

<script>
// import PshapePreview from '../elements/PshapePreview.vue'
import PicPreview from '../elements/PicPreview.vue'
import TextPreview from '../elements/TextPreview.vue'
import FormPreview from '../elements/FormPreview.vue'
import SlidesPreview from '../elements/SlidesPreview.vue'
import ShapePreview from '../elements/ShapePreview.vue'
import elementHelper from '../../mixins/elementHelper'


export default {
  name: 'page-thumb',
  mixins: [elementHelper],
  props: ['state', 'actions', 'pageId'],

  data() {
    return {
    }
  },
  computed: {
    page() {
      if(!this.state) return -1
      else return this.state.getIn(['pages', '' + this.pageId])
    },
    elementsIds() {
      return this.page.get('elements').toJS()
    },
    elements() {
      // return this.state.get('elements').toJS()
      return this.state.get('elements')
    },
    colorStyle() {
      return {
        backgroundColor: this.page.get('bgcolor')
      }
    },
    imgStyle() {
      return {
        top: this.px(this.page.get('t')),
        left: this.px(this.page.get('l')),
        width: this.px(this.page.get('w')),
        height: this.px(this.page.get('h')),
        opacity: this.page.get('opacity')
      }
    },
    pagesIdList() {
      return this.state.getIn(['project', '0', 'pages']).toArray()
    },
    elementsIdList() {
      return this.state.getIn(['pages', ''+this.pageId, 'elements']).toArray()
    }
  },
  methods: {
    getStyle(id) {
      let style = {zIndex: 0}
      let specials = ['pEraser']
      if (specials.indexOf(this.elements.getIn([id+'', 'type'])) > -1) {
        style.zIndex = 1
      }
      return style
    },
    deletePage() {
      this.actions.deletePage(this.pageId, this.pagesIdList, this.elementsIdList)
    }
  },
  components: {
    'pic-preview': PicPreview,
    'text-preview': TextPreview,
    'form-preview': FormPreview,
    'slides-preview': SlidesPreview,
    'shape-preview': ShapePreview
  }
}
</script>
