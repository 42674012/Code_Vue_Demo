<template lang="jade">
.pic-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row
          button.btn.btn-default.change(@click='changePic') 图片更换
        p 图片剪裁比例
        .panel-row
          button.btn.btn-sm.crop(@click='toggleCrop(0)') 自由
          button.btn.btn-sm.crop(@click='toggleCrop(1)') 1 : 1
          button.btn.btn-sm.crop(@click='toggleCrop(2/3)') 2 : 3
          button.btn.btn-sm.crop(@click='toggleCrop(4/3)') 4 : 3
          button.btn.btn-sm.crop(@click='toggleCrop(16/9)') 16 : 9
        .panel-row.opacity
          .label 透明
          slider.slider(:min='0', :max='1', :step='0.01', :value='parseInt(opacity, 10) / 100',
          :startcb='setOpacityUndoable',
          :slidecb='setOpacity')
          input.value(v-model='opacity', number, lazy)
        .panel-row.radius
          .label 圆角
          slider.slider(:min='0', :max='100', :step='1', :value='parseInt(borderradius, 10)',
          :startcb='setRadiusUndoable',
          :slidecb='setRadius')
          input.value(v-model='borderradius', number, lazy)
        .panel-row.rotate
          .label 旋转
          slider.slider(:min='0', :max='360', :step='1', :value='parseInt(rotate, 10)',
          :startcb='setRotateUndoable',
          :slidecb='setRotate')
          input.value(v-model='rotate', number, lazy)
        .panel-row.link
          .checkbox-wrap
            input(type='checkbox',v-model='linkTrigger')
            .label 链接
          .link-content(v-show='linkTrigger',:title="linkContent") {{linkContent}}
          button.btn.btn-default(v-show='linkTrigger' @click="toggleLinkModal")
            i.iconfont.icon-bianji
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

.pic-panel
  .panel-row
    button.crop
      max-width 45px

    &.size
    &.pos
      .label
        max-width 30px
        flex 1
      .input-field
        max-width 100px
        flex 3

    &.opacity
    &.radius
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
        white-space nowrap
        
      .checkbox-wrap
        width 50px
        height 30px
        .label 
          float right
          line-height 30px
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Slider from '../widgets/Slider.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import ToggleButton from '../widgets/ToggleButton.vue'
import AnimationPanel from './AnimationPanel.vue'
import TriggerPanel from './TriggerPanel.vue'
import config from '../../config'

export default {
  name: 'pic-panel',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
    }
  },
  computed: {
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
        let pic = this.picProcess(parseInt(value) || 0, this.element.get('h'), false)
        this.actions.setElementUndoable(this.elementid, pic)
      }
    },
    h: {
      get() {
        return this.px(this.element.get('h'))
      },
      set(value) {
        let pic = this.picProcess(this.element.get('w'), parseInt(value) || 0, true)
        this.actions.setElementUndoable(this.elementid, pic)
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
    borderradius: {
      get() {
        return this.element.get('borderradius') + '%'
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 100 ? 100 : value
        this.actions.setElementUndoable(this.elementid, {
          borderradius: value
        })
      }
    },
    boxshadow: {
      get() {
        return this.px(this.element.get('boxshadow') || 0)
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 100 ? 100 : value
        this.actions.setElementUndoable(this.elementid, {
          boxshadow: value
        })
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
    setRadius(value) {
      this.actions.setElement(this.elementid, {
        borderradius: value
      })
    },
    setRadiusUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        borderradius: value
      })
    },
    setShadow(value) {
      this.actions.setElement(this.elementid, {
        boxshadow: value
      })
    },
    setShadowUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        boxshadow: value
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
    setEditableUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        editable: value
      })
    },
    changePic() {
      // this.actions.toggleControlPanel({type: 'piclib', changingImg: true})
      this.$dispatch('SHOW_PICLIB', {scenario: 'CHANGE_PIC'})
    },

    toggleCrop(aspectRatio) {
      this.$dispatch('CROP_IMAGE', {
        elementid: this.elementid,
        aspectRatio
      })
    },
    picProcess(w1, h1, vertical) {
      let h = this.element.get('h'),
        w = this.element.get('w'),
        inw = this.element.get('iw'),
        inh = this.element.get('ih'),
        inleft = this.element.get('il'),
        intop = this.element.get('it'),
        wr = (w / 2 - inleft) / inw,
        hr = (h / 2 - intop) / inh,
        el = {w: w1, h: h1},
        inw1,
        inh1,
        inleft1, intop1

      // 移动图片使中心不变
      if (vertical) {
        inh1 = hr < 0.5 ? h1 / 2 / hr : h1 / 2 / (1 - hr)
        inw1 = inh1 * inw / inh
        inleft1 = w1 / 2 - inw1 * wr
        intop1 = h1 / 2 - inh1 * hr
        if (inleft1 > 0 || inleft1 + inw1 < w1) {
          inw1 = wr < 0.5 ? w1 / 2 / wr : w1 / 2 / (1 - wr)
          inh1 = inw1 * inh / inw
          inleft1 = w1 / 2 - inw1 * wr
          intop1 = h1 / 2 - inh1 * hr
        }
      } else {
        inw1 = wr < 0.5 ? w1 / 2 / wr : w1 / 2 / (1 - wr)
        inh1 = inw1 * inh / inw
        inleft1 = w1 / 2 - inw1 * wr
        intop1 = h1 / 2 - inh1 * hr
        if (intop1 > 0 || intop1 + inh1 < h1) {
          inh1 = hr < 0.5 ? h1 / 2 / hr : h1 / 2 / (1 - hr)
          inw1 = inh1 * inw / inh
          inleft1 = w1 / 2 - inw1 * wr
          intop1 = h1 / 2 - inh1 * hr
        }
      }
      el.h = h1
      el.w = w1
      el.iw = inw1
      el.ih = inh1
      el.il = inleft1
      el.it = intop1
      return el
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
    'trigger-panel': TriggerPanel,
    'toggle': ToggleButton
  },
  beforeDestroy() {
    this.$dispatch('CROP_IMAGE', {
      elementid: -1
    })
  }
}
</script>
