<template lang="jade">
.form-panel
  tabs.tabs
    tab(header='设置')
      // .title 选择表单样式
      .panel-content
        .panel-row 表单名称
        .panel-row.formname
          textarea(v-model='formname', lazy)
        .panel-row 表单设置
        .list-wrap
          .panel-row.list(v-for='(index, list) in lists')
            input(type='text', v-model='list.label', lazy, @change='onChange')
            i.iconfont.icon-false-circle(v-if='lists.length > 1', @click='deleteList(index)')
            input(type='checkbox', v-model='list.required', @change='onChange')
            .label 必填
          .panel-row.list(v-if='lists.length < 10')
            input(type='text', v-model='addLabel')
            i.iconfont.icon-icontianjia01(@click='addList')
        .panel-row.line
        .panel-row 请输入按钮文字
        .panel-row
          input(type='text', placeholder='按钮文字', v-model='btntext', lazy)
        .panel-row 请输入反馈信息
        .panel-row
          input(type='text', placeholder='感谢您的信息反馈', v-model='feedback', lazy)
        .panel-row.line
        .panel-row
          .label 文字颜色
          color-picker.colorpicker(:color='fontcolor', :startcb='setFontColorUndoable', :stopcb='setFontColor')
        .panel-row
          .label 按钮颜色
          color-picker.colorpicker(:color='btncolor', :startcb='setBtnColorUndoable', :stopcb='setBtnColor')
        .panel-row
          .label 边框颜色
          color-picker.colorpicker(:color='bordercolor', :startcb='setBorderColorUndoable', :stopcb='setBorderColor')
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
            input.value(v-model='x', number, lazy)
            .label X
          .input-field
            input.value(v-model='y', number, lazy)
            .label Y
    //
      tab(header='动作')
        animation-panel(
        :state='state',
        :actions='actions',
        :elementid='elementid',
        :element='element'
        )
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.form-panel
  .title
    height 35px
    line-height 35px
    font-size 1.6rem
    color #fff
    background-color #2d353a
    text-align center

  .list-wrap
    height 200px
    overflow-y scroll

  .panel-row
    color #fff
    button.crop
      max-width 45px
    input
      color #5a6267 
      background-color #fff

    &.formname
      textarea
        color #5a6267
        width 100%
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

    &.line
      height 1px
      background-color #2d353a

    &.list
      justify-content flex-start
      input[type='text']
        width 150px
        padding-left 10px
        text-align left
      input[type='checkbox']
        margin 0 0 0 15px
        width 20px

      .iconfont
        color #5a6267
        margin-left 10px
        height 30px
        line-height 30px
        cursor pointer
        &:hover
          color #abb3b9
        &.icon-icontianjia01
          font-size 19px

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Slider from '../widgets/Slider.vue'
import ToggleButton from '../widgets/ToggleButton.vue'
import ColorPicker from '../widgets/ColorPicker.vue'
import config from '../../config'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import AnimationPanel from './AnimationPanel.vue'


export default {
  name: 'form-panel',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      addLabel: ''
    }
  },
  computed: {
    bordercolor() {
      return this.element.get('bordercolor')
    },
    btncolor() {
      return this.element.get('btncolor')
    },
    // btntext() {
    //   return this.element.get('btntext')
    // },
    fontcolor() {
      return this.element.get('fontcolor')
    },
    lists() {
      let lists = this.element.get('lists')
      if (typeof lists === 'string' || lists === undefined) return []
      else return lists.toJS()
    },
    w: {
      get() {
        return this.px(this.element.get('w'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          w: parseInt(value) || 0
        })
      }
    },
    h: {
      get() {
        return this.px(this.element.get('h'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          h: parseInt(value) || 0
        })
      }
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
    btntext: {
      get() {
        return this.element.get('btntext')
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          btntext: value
        })
      }
    },
    feedback: {
      get() {
        return this.element.get('feedback')
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          feedback: value
        })
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
    formname: {
      get() {
        return this.element.get('name')
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          name: value
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
    setBorderColor(value) {
      this.actions.setElement(this.elementid, {
        bordercolor: value
      })
    },
    setBorderColorUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        bordercolor: value
      })
    },
    setBtnColor(value) {
      this.actions.setElement(this.elementid, {
        btncolor: value
      })
    },
    setBtnColorUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        btncolor: value
      })
    },
    setFontColor(value) {
      this.actions.setElement(this.elementid, {
        fontcolor: value
      })
    },
    setFontColorUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        fontcolor: value
      })
    },
    deleteList(index) {
      let listsArray = this.lists
      // 至少一个输入
      if (listsArray.length <= 1) return
      listsArray.splice(index, 1)
      this.actions.setElementUndoable(this.elementid, {
        lists: ''
      })
      this.actions.setElement(this.elementid, {
        lists: listsArray
      })
    },
    addList() {
      let listsArray = this.lists
      // 最多5个输入
      if (listsArray.length >= 10) return
      listsArray.push({
        id: new Date().getTime(),
        label: this.addLabel,
        require: false
      })
      this.actions.setElementUndoable(this.elementid, {
        lists: listsArray
      })
      this.addLabel = ''
    },
    onChange() {
      this.actions.setElementUndoable(this.elementid, {
        lists: this.lists
      })
    }
  },
  components: {
    'slider': Slider,
    'color-picker': ColorPicker,
    'tabs': Tabset,
    'tab': Tab,
    'animation-panel': AnimationPanel,
  },
  ready() {
    $('.form-panel .list-wrap').niceScroll({
      cursorcolor: '#5a6267',
      cursorborder: '0px',
      cursorwidth: 5,
      // railpadding: {right: 5},
      autohidemode: false,
      horizrailenabled: false,
      railpadding: {top: 0, right: 0, left: 20, bottom: 0}
    })
  }

}
</script>
