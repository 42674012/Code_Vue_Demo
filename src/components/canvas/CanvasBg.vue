<template lang="jade">
.bg-layer(:style='wrapperStyle', :class='{selected: selectedElementId === -1}', @click='onClick')
  .img-layer(v-if='page.get("bgpic")', :style='imageStyle')
    img(:src='page.get("bgpic")')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.bg-layer
  position relative
  width 320px
  background-color #fff
  overflow hidden
  z-index 0

  /*&.selected
    border 1px solid #747373*/

  .img-layer
    position absolute
    img
      width 100%
      height 100%
      -webkit-user-drag none
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
export default {
  name: 'canvas-bg',
  props: ['state', 'actions', 'pageid', 'page'],
  mixins: [elementHelper],
  computed: {
    slugid() {
      return this.state.getIn(['editorStatus', 'slugId'])
    },
    wrapperStyle() {
      let ch = this.page.get('ch')
      let height = ch || this.state.getIn(['editorStatus', 'canvasHeight'])

      return {
        backgroundColor: this.page.get('bgcolor'),
        height: this.px(height)
      }
    },
    imageStyle() {
      return {
        left: this.px(this.page.get('l')),
        top: this.px(this.page.get('t')),
        width: this.px(this.page.get('w')),
        height: this.px(this.page.get('h')),
        opacity: this.page.get('opacity'),
      }
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    }
  },
  methods: {
    onClick() {
      this.actions.selectElement(-1)
    }
  },
  ready() {
    let vm = this
    $.contextMenu({
      selector: '.bg-layer',
      animation: {duration: 0, show: 'show', hide: 'hide'},
      className: 'contextmenu-custom contextmenu-custom__highlight',
      items: {
        copy: {
          name: '粘贴',
          disabled: () => !vm.state.getIn(['editorStatus', 'copiedElement']),
          callback: (key, opt) => {
            let copiedElement = vm.state.getIn(['editorStatus', 'copiedElement'])
            if (copiedElement) {
              vm.actions.addElement(copiedElement.toJS(), vm.pageid, vm.slugid)
            }
          }
        }
      }
    })

    this.$on('KEYBOARD_EVENT', payload => {
      if (payload.type === 'paste') {
        let copiedElement = this.state.getIn(['editorStatus', 'copiedElement'])
        if (copiedElement) {
          this.actions.addElement(copiedElement.toJS(), this.pageid, this.slugid)
        }
        return false
      }
      return true
    })
  }
}
</script>
