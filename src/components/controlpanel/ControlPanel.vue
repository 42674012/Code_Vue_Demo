<template lang="jade">
.control-panel
  component(:is='controlPanel',
  :state='state',
  :actions='actions',
  :elementid='selectedElementId',
  :element='element',
  :pageid='pageid',
  :page='page',
  :slugid = 'slugid',
  v-ref:child)
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.control-panel
  position absolute
  width 100%
  height 100%
  padding 0
</style>

<script>
import BgPanel from './BgPanel.vue'
import MusicPanel from './MusicPanel.vue'
import PicPanel from './PicPanel.vue'
import TextPanel from './TextPanel.vue'
import FormPanel from './FormPanel.vue'
import SlidesPanel from './SlidesPanel.vue'
import ShapePanel from './ShapePanel.vue'
import PostPanel from './PostPanel.vue'
import HeaderPanel from './HeaderPanel.vue'
import FooterPanel from './FooterPanel.vue'
import PageEffectPanel from './PageEffectPanel.vue'
import EventListener from '../../helpers/events'

export default {
	name: 'control-panel',
	props: ['state', 'actions'],
  computed: {
    controlPanel() {
      return this.state.getIn(['editorStatus', 'controlPanel', 'type'])
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    element() {
      return this.state.getIn(['elements', this.selectedElementId + ''])
    },
    pageid() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    page() {
      return this.state.getIn(['pages', this.pageid + ''])
    },
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    }
  },
  methods: {
  },
	components: {
    'bg-panel': BgPanel,
    'music-panel': MusicPanel,
    'pic-panel': PicPanel,
    'text-panel': TextPanel,
    'form-panel': FormPanel,
    'slides-panel': SlidesPanel,
    'shape-panel': ShapePanel,
    'post-panel': PostPanel,
    'header-panel': HeaderPanel,
    'footer-panel': FooterPanel,
    'pageeffect-panel': PageEffectPanel
	},
  ready() {
    // prevent keydown keyup event from propagation
    EventListener.listen(this.$el, 'keydown', e => e.stopPropagation())
    EventListener.listen(this.$el, 'keyup', e => e.stopPropagation())
  }
}
</script>
