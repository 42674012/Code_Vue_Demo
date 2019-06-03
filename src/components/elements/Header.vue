<template lang="jade">
div
  wrapper-element(
  :state='state',
  :actions='actions',
  :elementid='elementid',
  :element='element'
  )
    .outer-element(:style='outerStyle')
      .logo(v-if='logo && logo.get("toggle")')
        img(:src='logourl')
      .title(:class='{logoon: logo ? logo.get("toggle") : false}') {{title}}

    operate(:state='state', :actions='actions', :elementid='elementid', :element='element', v-show='isShowOperate')


</template>

<style lang="stylus" >

.outer-element
  position relative
  width 100%


  .logo
    position absolute
    width 50px
    height 50px
    padding 5px
    img
      width 100%


  .title
    position absolute
    height 50px 
    line-height 50px
    width 310px 
    font-size 1.8rem
    margin-left 10px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

    
    span
      line-height 50px
   
   .logoon {
     left 50px
     width 260px
   }

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import WrapperElement from './Wrapper.vue'
import OuterElement from './Outer.vue'
import Operate from './Operate.vue'
import {getCropImage} from '../../helpers/common'

export default {
  name: 'header-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    outerStyle() {
      return {
        backgroundColor: this.element.get('bgcolor'),
        color: this.element.get('fontcolor'),
        height: this.px(this.element.get('h'))
        // borderColor: this.element.get('border-color'),
        // borderStyle: this.element.get('border-style'),
        // borderWidth: this.element.get('border-width'),
        // borderRadius: this.px(this.element.get('borderradius') * this.h / 200)
        // boxShadow: `0 0 ${this.px(this.element.get('boxshadow'))} #000`
      }
    },
    title() {
      return this.element.get('title')
    },

    logo() {
      return this.element.get('logo')
    },
    logourl() {
      return getCropImage(
        this.element.getIn(['logo', 'url']),
        { 
          crop: this.element.getIn(['logo', 'crop']).toJS(),
          ratio: {w: 45}
        })
    },
    isShowOperate() {
      return !!~this.state.getIn(['editorStatus', 'selectedElements']).indexOf(this.elementid)
    }

    // style() {
      // return {
      //   fontFamily: 'Arial',
      //   color: this.element.get('color'),
      //   fontSize: this.px(this.element.get('size')),
      //   fontWeight: this.element.get('bold') ? 'bold' : 'normal',
      //   fontStyle: this.element.get('italic') ? 'italic' : 'normal',
      //   fontDecoration: this.element.get('url') ? 'underline' : 'none',
      //   lineHeight: this.element.get('lineheight'),
      //   // textAlign: this.element.get('textalign'),
      //   textDecoration: this.element.get('udl') ? 'underline' : 'none',
      //   opacity: this.element.get('opacity'),
      //   wordWrap: 'break-word',
      //   whiteSpace: 'pre-wrap'
      // }
    // },
  },
  components: {
    'wrapper-element': WrapperElement,
    'outer-element': OuterElement,
    'operate': Operate
  },
  ready() {
  }
}
</script>
