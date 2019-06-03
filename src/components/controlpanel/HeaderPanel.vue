<template lang='jade'>
.header-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row.title
          .label 文本
          input(type='text', v-model='title')
        .panel-row.color
          .label 文字颜色
          color-picker.colorpicker(:color='fontcolor', :startcb='setFontColorUndoable', :movecb='setFontColor')
          .label 背景颜色
          color-picker.colorpicker(:color='bgcolor', :startcb='setBgColorUndoable', :movecb='setBgColor')
        .panel-row.line
        .panel-row.logo-toggle
          .label 添加Logo 
          toggle(:value="logoOn", :callback="toggleLogo", style='width: 170px')
        .panel-row(v-show='logoOn')
          button.btn.btn-default.change-button(@click='changeLogo') 更换Logo
          button.btn.btn-default.remove-button(@click='removeLogo') 删除Logo
        .crop-area(v-show='logoOn')
          image-crop(:element='element', :ratio='{x: 50, y: 50}', :startcb='setCropUndoable', :cropcb='setCrop')

    tab(header="动作")
      animation-panel(
      :state='state',
      :actions='actions',
      :elementid='elementid',
      :element='element'
      )

</template>

<style lang="stylus">
@import '../../variables.styl'

.header-panel
  .label
    color #fff

  .title
    .label
      flex 2
    input
      flex 5
      color #000
      background-color #fff
      text-align left
  
  .crop-area
    width 260px
    height 290px
    margin 10px auto 0px auto
    background-color #ff
   
  .change-button
  .remove-button
    max-width 120px



  
</style>

<script>
import ElementHelper from '../../mixins/elementHelper'
import ColorPicker from '../widgets/ColorPicker.vue'
import ToggleButton from '../widgets/ToggleButton.vue'
import ImageCrop from '../widgets/ImageCropHeader.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import AnimationPanel from './AnimationPanel.vue'

export default {
  data() {
    return {
    }
  },
  mixins: [ElementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    title: {
      get() {
        return this.element.get('title')
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, { title: value })
      }
    },
    bgcolor() {
      return this.element.get('bgcolor')
    },
    fontcolor() {
      return this.element.get('fontcolor')
    },
    logoOn() {
      return this.element.getIn(['logo', 'toggle'])
    }
  },
  methods: {
    setFontColor(value) {
      this.actions.setElement(this.elementid, {
        fontcolor: value
      })
    },
    setBgColor(value) {
      this.actions.setElement(this.elementid, {
        bgcolor: value
      })
    },
    setFontColorUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        fontcolor: value
      })
    },
    setBgColorUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        bgcolor: value
      })
    },
    toggleLogo(val) {
      this.actions.setElementUndoable(this.elementid, {
        logo: {toggle: val}
      })
    },
    changeLogo() {
      this.$dispatch('SHOW_PICLIB', {scenario: 'CHANGE_HEADER_LOGO'})
    },
    removeLogo() {
      this.actions.setElementUndoable(this.elementid, {
        logo: {url: ''},
      })
    },
    setCrop(value) {
      // let payload = {
      //   crop: value.cropData,
      // }
      this.actions.setElement(this.elementid, { logo: { crop: value.cropData}})
    },
    setCropUndoable(value) {
      let payload = {
        crop: value.cropData,
      }
      // this.actions.setPageUndoable(this.pageid, payload)
      this.actions.setElementUndoable(this.elementid, { logo: { crop: value.cropData}})
    }
  },
  components: {
    'tabs': Tabset,
    'tab': Tab,
    'color-picker': ColorPicker,
    'toggle': ToggleButton,
    'image-crop': ImageCrop,
    'animation-panel': AnimationPanel
  },
  ready() {
  }
}
</script>
