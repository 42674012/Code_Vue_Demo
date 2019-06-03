<template lang="jade">
.shape-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row
          button.btn.btn-default(@click='changeShape') 形状更换
        .panel-row.colorpicker
          .label(style="margin-right: 15px") 颜色
          color-picker.color(v-for='(key, color) in colors', :color='color', :startcb='setColorUndoable(key)', :movecb='setColor(key)')
        .panel-row.link
          .checkbox-wrap
            input(type='checkbox',v-model='linkTrigger')
            .label 链接
          .link-content(v-show='linkTrigger',:title="linkContent") {{linkContent}}
          button.btn.btn-default(v-show='linkTrigger' @click="toggleLinkModal")
            i.iconfont.icon-bianji

        .panel-row.opacity
          .label 透明
          slider.slider(:min='0', :max='1', :step='0.01', :value='parseInt(opacity, 10) / 100',
          :startcb='setOpacityUndoable',
          :slidecb='setOpacity')
          input.value(v-model='opacity', number, lazy)
        .panel-row.rotate
          .label 旋转
          slider.slider(:min='0', :max='360', :step='1', :value='parseInt(rotate, 10)',
          :startcb='setRotateUndoable',
          :slidecb='setRotate')
          input.value(v-model='rotate', number, lazy)

        .panel-row.size
          .label 大小
          .input-field
            input.value(v-model='h', number, lazy)
            .label 长
          .input-field
            input.value(v-model='w', number, lazy)
            .label 宽
        .panel-row.pos
          .label 位置
          .input-field
            input.value(v-model='x' lazy)
            .label X
          .input-field
            input.value(v-model='y' lazy)
            .label Y
    tab(header='动作')
      animation-panel(
      :state='state',
      :actions='actions',
      :elementid='elementid',
      :element='element'
      )
    //
      tab(header='触发')
        trigger-panel(:state='state', :actions='actions', :elementid='elementid', :element='element')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.shape-panel
  .panel-row
    &.colorpicker
      justify-content flex-start
      .color
        margin-right 10px


    &.size
    &.pos
      .label
        max-width 30px
        flex 1
      .input-field
        max-width 100px
        flex 3

    &.opacity
    &.rotate
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

    &.link
      input[type='checkbox']
        margin 0
        width 20px
      .link-content
        margin 0 5px
        width 160px
        line-height 34px
        border-radius 4px
        background-color #454d53
        overflow hidden
        text-overflow ellipsis
        white-space nowra
      .checkbox-wrap
        width 50px
        height 30px
        .label 
          float right
          line-height 30p
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Slider from '../widgets/Slider.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import AnimationPanel from './AnimationPanel.vue'
import ColorPicker from '../widgets/ColorPicker.vue'
import config from '../../config'
import TriggerPanel from './TriggerPanel.vue'

export default {
  name: 'shape-panel',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
    }
  },
  computed: {
    colors() {
      let colors = {}
      let vm = this

      this.element.get('colors').entrySeq().forEach(item => {
        colors[`${vm.elementid}-${item[0]}`] = item[1]
      })
      return colors
    },
    x: {
      get() {
        return this.px(this.element.get('l'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          l: parseInt(value) || 0
        })
      }
    },
    y: {
      get() {
        return this.px(this.element.get('t'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          t: parseInt(value) || 0
        })
      }
    },
    w: {
      get() {
        return this.px(this.element.get('w'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {w: parseInt(value) || 0})
      }
    },
    h: {
      get() {
        return this.px(this.element.get('h'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {h: parseInt(value) || 0})
      }
    },
    opacity: {
      get() {
        return this.percent(1 - this.element.get('opacity'))
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 100 ? 100 : value
        this.actions.setElementUndoable(this.elementid, {
          opacity: (100 - value) / 100
        })
        return value / 100
      }
    },
    rotate: {
      get() {
        return this.element.get('rotate') + '°'
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 360 ? 360 : value
        this.actions.setElementUndoable(this.elementid, {
          rotate: value
        })
      }
    },

    linkContent() {
      return this.element.getIn(['trigger', 'v'])
    },

    linkTrigger: {
      get() {
        return this.element.getIn(['trigger', 'on'])
      },
      set(val) {
        this.actions.setElementUndoable(this.elementid, {
          trigger: {on: val}
        })
      }
    }

  },
  methods: {
    setOpacity(value) {
      this.actions.setElement(this.elementid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setOpacityUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setRotate(value) {
      this.actions.setElement(this.elementid, {
        rotate: value
      })
    },
    setRotateUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        rotate: value
      })
    },
    setColor(colorname) {
      let vm = this
      return function (value) {
        let colors = {}
        let key = colorname.split('-')[1]
        colors[key] = value
        vm.actions.setElement(vm.elementid, {
          colors: colors
        })
      }
    },
    setColorUndoable(colorname) {
      let vm = this
      return function (value) {
        let colors = {}
        let key = colorname.split('-')[1]
        colors[key] = value
        vm.actions.setElementUndoable(vm.elementid, {
          colors: colors
        })
      }
    },
    changeShape() {
      this.$dispatch('SHOW_SHAPELIB', {scenario: 'CHANGE_SHAPE'})
    },
    toggleLinkModal() {
      this.$dispatch('SHOW_LINKMODAL', {
        elementid: this.elementid,
        element: this.element,
        callback: (p) => {
          this.actions.setElementUndoable(this.elementid, {
            trigger: {
              t: p.linkType,
              v: p.linkValue 
            }
          })
        }
      })
    }

  },
  components: {
    'slider': Slider,
    'tabs': Tabset,
    'tab': Tab,
    'animation-panel': AnimationPanel,
    'color-picker': ColorPicker,
    'trigger-panel': TriggerPanel
  }

}
</script>
