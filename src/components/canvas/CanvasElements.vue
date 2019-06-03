<template lang="jade">
.elements-layer
  group-element(:state='state', :actions='actions', v-if="isShowGroup")
  component(v-for='elementId in elementsIdList',
  :is='elements.getIn([elementId+"", "type"]) + "-element"',
  :state='state',
  :actions='actions',
  :elementid='elementId',
  :element='elements.get(elementId+"")',
  :style='getStyle(elementId)',
  )
</template>

<style lang="stylus" scoped>
.elements-layer
  position absolute
  top 0px
  left 0px
  z-index 0
</style>

<script>
import PicElement from '../elements/Pic.vue'
import TextElement from '../elements/Text.vue'
import FormElement from '../elements/Form.vue'
import SlidesElement from '../elements/Slides.vue'
import ShapeElement from '../elements/Shape.vue'
import PostElement from '../elements/Post.vue'
import HeaderElement from '../elements/Header.vue'
import FooterElement from '../elements/Footer.vue'
import GroupElement from '../elements/Group.vue'

export default {
  name: 'canvas-elements',
  props: ['state', 'actions', 'page', 'elements'],
  computed: {
    elementsIdList() {
      let elements = this.page.get('elements').toJS()
      return elements.filter(eid => !!this.elements.get(eid+""))
    },
    isShowGroup() {
      return this.state.getIn(['editorStatus', 'selectedElements']).size > 1
    }
  },
  methods: {
    getStyle(elementid) {
      let style = {
        position: 'absolute',
        zIndex: 0
      }
      let elementType = this.elements.getIn([elementid+'', 'type'])
      let specials = ['pEraser']
      if (specials.indexOf(elementType) > -1) {
        style.zIndex = 1
      }
      return style
    }

  },
  components: {
    'pic-element': PicElement,
    'text-element': TextElement,
    'form-element': FormElement,
    'slides-element': SlidesElement,
    'shape-element': ShapeElement,
    'post-element': PostElement,
    'header-element': HeaderElement,
    'footer-element': FooterElement,
    'group-element': GroupElement
  },
  ready(){
    // this.$dispatch('ANIMATE_SHOW', null)
  }
}
</script>
