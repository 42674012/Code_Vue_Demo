<template lang="jade">
.canvas-preview(@click.stop='onclick')
  component(:is='element.get("type") + "-element-preview"',
  :state='state',
  :element='element', keep-alive
  )

</template>

<style lang="stylus" scoped>
.canvas-preview
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  z-index 1

</style>

<script>
import PicPreview from '../elements/PicPreview.vue'
import PtextElement from '../elements/Ptext.vue'
import PshapePreview from '../elements/PshapePreview.vue'
import ComparisonPreview from '../elements/magic/ComparisonPreview.vue'
import EraserPreview from '../elements/magic/EraserPreview.vue'
import FingerPrintPreview from '../elements/magic/FingerPrintPreview.vue'
import GlassBreakPreview from '../elements/magic/GlassBreakPreview.vue'
import PhoneCallPreview from '../elements/magic/PhoneCallPreview.vue'

export default {
  name: 'canvas-preview',
  props: ['state', 'actions', 'element'],
  computed: {
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    },
    pageid() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    controlPanel() {
      return this.state.getIn(['editorStatus', 'controlPanel'])
    },
    previewElement() {
      return this.state.getIn(['editorStatus', 'previewElement'])
    }
  },
  methods: {
    onclick() {
      this.$dispatch('PREVIEW_CLICK', this.controlPanel)
    }
  },

  components: {
    'pic-element-preview': PicPreview,
    'ptext-element': PtextElement,
    'pshape-element-preview': PshapePreview,
    'comparison-element-preview': ComparisonPreview,
    'pEraser-element-preview': EraserPreview,
    'phone_call-element-preview': PhoneCallPreview,
    'glass_break-element-preview': GlassBreakPreview,
    'fingerPrint-element-preview': FingerPrintPreview
  }
}
</script>
