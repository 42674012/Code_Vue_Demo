<template lang="jade">
.bg-panel
  .panel-title
    span 页面背景设置
  .panel-content
    .panel-row
      button.btn.btn-default.change-button(@click='changeBg') 更换背景
      button.btn.btn-default.remove-button(@click='removeBg') 删除背景
    .crop-area
      image-crop(:page='page', :ratio='{x: 640, y: 1008}', :startcb='setCropUndoable', :cropcb='setCrop')
    .panel-row
      .label 背景颜色
      color-picker.color(:color='bgcolor', :startcb='setColorUndoable', :movecb='setColor')
    .panel-row.opacity
      .label 透明
      slider.slider(:min='0', :max='1', :step='0.01', :value='parseInt(opacity, 10) / 100',
      :startcb='setOpacityUndoable',
      :slidecb='setOpacity')
      input.value(v-model='opacity', number, lazy)
    //
      .panel-row.page-effect
        span 翻页效果设置
        dropdown.dropdown
          button.btn.btn-default(data-toggle='dropdown') {{pageEffectName}}
            div.caret.pull-right
          ul.dropdown-menu(slot='dropdown-menu')
            li(v-for='e in pageeffects')
              a(href='#', @click='selectEffect(e)') {{e.name}}




</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.panel-title
  width 100%
  height 40px
  color #fff
  line-height 40px
  text-align center
  background-color #2d353a

.panel-content
  .panel-row
    .change-button
      max-width 120px
    .remove-button
      max-width 120px
    .color
      margin-left 10px
    &.opacity
      .label
        flex 1
        max-width 30px
      .slider
        flex 2
        max-width 150px
        margin-top 8px
      input
        flex 1
        max-width 50px
    &.page-effect
      span
        line-height 30px
    .dropdown
      .caret
        position absolute
        top 50%
        right 10px
      button
        width 100px
        height 30px
        border none
      li>a:hover
        background-color: #179eff

  .crop-area
    width 260px
    height 290px
    margin 10px auto 0px auto
    background-color #fff

</style>

<script>
import Slider from '../widgets/Slider.vue'
import ColorPicker from '../widgets/ColorPicker.vue'
import ImageCrop from '../widgets/ImageCrop.vue'
import Dropdown from '../widgets/Dropdown.vue'
import { PAGE_ANIMATION } from '../../models/animations'
import elementHelper from '../../mixins/elementHelper'

export default {
  name: 'bg-panel',
  props: ['state', 'actions', 'pageid', 'page'],
  mixins: [elementHelper],
  data() {
    return {
      pageeffects: PAGE_ANIMATION
    }
  },
  computed: {
    opacity: {
      get() {
        return this.percent(1 - this.page.get('opacity'))
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 100 ? 100 : value
        this.actions.setPageUndoable(this.pageid, {
          opacity: (100 - value) / 100
        })
        return value / 100
      }
    },
    bgcolor() {
      let bgcolor = this.page.get('bgcolor')
      return bgcolor
    },
    imgsrc() {
      return this.page.get('bgpic')
    },
    pageEffectName() {
      let name = ''
      let effect = this.page.get('effect')
      for (let ani of this.pageeffects) {
        if (effect === ani.effect) {
          name = ani.name
          break
        }
      }
      return name
    }
  },
  methods: {
    changeBg() {
      // this.actions.toggleControlPanel({type: 'piclib', changingBg: true})
      this.$dispatch('SHOW_PICLIB', {scenario: 'CHANGE_BG'})
    },
    removeBg() {
      this.actions.setPageUndoable(this.pageid, {
        bgpic: '',
        opacity: 0.3
      })
    },
    selectEffect(ani) {
      this.actions.setPage(this.pageid, {
        effect: ani.effect
      })
    },
    setOpacity(value) {
      this.actions.setPage(this.pageid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setOpacityUndoable(value) {
      this.actions.setPageUndoable(this.pageid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setOpacityByColor(color) {
      let opacity = this.page.get('opacity')
      if (color) {
        if (!this.page.get('bgcolor'))
          opacity = 0.3
      } else {
        opacity = 1
      }

      return opacity
    },
    setColor(value) {
      this.actions.setPage(this.pageid, {
        bgcolor: value,
        opacity: this.setOpacityByColor(value)
      })
    },
    setColorUndoable(value) {
      this.actions.setPageUndoable(this.pageid, {
        bgcolor: value,
        opacity: this.setOpacityByColor(value)
      })
    },
    setCrop(value) {
      let payload = {
        crop: value.cropData,
        w: value.width,
        h: value.height,
        l: value.left,
        t: value.top
      }
      this.actions.setPage(this.pageid, payload)
    },
    setCropUndoable(value) {
      let payload = {
        crop: value.cropData,
        w: value.width,
        h: value.height,
        l: value.left,
        t: value.top
      }
      this.actions.setPageUndoable(this.pageid, payload)
    }

  },
  components: {
    'slider': Slider,
    'color-picker': ColorPicker,
    'image-crop': ImageCrop,
    'dropdown': Dropdown
  }
}
</script>
