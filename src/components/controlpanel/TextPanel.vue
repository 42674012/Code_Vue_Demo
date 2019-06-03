<template lang='jade'>
.text-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row(style='margin-top: 0')
        div.editor(v-quill:text='state.getIn(["editorStatus", "selectedElementId"])', :toolbar='$els.toolbar')
        .panel-row
          //
            .label 颜色
            color-picker.colorpicker(:color='ftcolor', :startcb='setColorUndoable', :movecb='setColor')
          .label 字号
          .fontsize
            dropdown.dropdown
              button.btn.btn-default(data-toggle='dropdown') {{fontsize}}
                div.caret
              ul.dropdown-menu(slot='dropdown-menu')
                li(v-for='fs in fontsizes')
                  a(href='#', @click='setFontsize(fs)') {{fs}}
          .label(style='margin: 0 5px') 行距
          .lineheight
            dropdown.dropdown
              button.btn.btn-default(data-toggle='dropdown') {{lineheight}}
                div.caret
              ul.dropdown-menu(slot='dropdown-menu')
                li(v-for='lh in lineheights')
                  a(href='#', @click='setLineheight(lh)') {{lh+'倍'}}
        //
          .panel-row.toolbar
            .label 文字设置
            i.iconfont.icon-bold(href='#', :class='{active: fontbold}', @click='setBold')
            i.iconfont.icon-italic(href='#', :class='{active: fontitalic}', @click='setItalic')
            i.iconfont.icon-underline(href='#', :class='{active: udl}', @click='setUdl')
            i.iconfont.icon-align-left(href='#', :class='{"active": textalign === "left"}', @click='setTextAlign("left")')
            i.iconfont.icon-align-center(href='#', :class='{"active": textalign === "center"}', @click='setTextAlign("center")')
            i.iconfont.icon-align-right(href='#', :class='{"active": textalign === "right"}', @click='setTextAlign("right")')

        

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

        .panel-row.pos
          .label 位置
          .input-field
            input.value(v-model='x' lazy)
            .label X
          .input-field
            input.value(v-model='y' lazy)
            .label Y
        .panel-row.line
        .panel-row.pos
          .label 大小 
          .input-field
            input.value(v-model='w' lazy)
            .label 宽 
          .input-field
            <!--input.value(v-model='y' lazy)-->
            .label 高 
        //
          .panel-row
            .label(style='margin-right: 5px') 宽度
            .input-field.width
              input.value(v-model='w' lazy)
            .label(style='margin: 0 5px') 行距
            .lineheight
              dropdown.dropdown
                button.btn.btn-default(data-toggle='dropdown') {{lineheight}}
                  div.caret
                ul.dropdown-menu(slot='dropdown-menu')
                  li(v-for='lh in lineheights')
                    a(href='#', @click='setLineheight(lh)') {{lh+'倍'}}

    tab(header="动作")
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

<style lang="stylus">
@import '~quill/dist/quill.snow.css'
@import '../../variables.styl'
@import '../../assets/app.styl'


.text-panel
  .panel-content
    width 260px
    height 100%
    padding-top 10px
    margin auto

    .editor
      // -webkit-user-select text 
      // -moz-user-select text

    .panel-row
      display flex
      display -webkit-flex
      justify-content space-between
      margin-top 10px



      &.toolbar
        i
          flex 1
          font-size 1.5rem
          text-align center
          line-height 30px
          max-width 30px
          color #abb3b9
          background-color #2d353a
          cursor pointer

          &.active
            background-color #575e67
            color #fff


      &>.colorpicker
        flex 1
        text-align center

      &>.width
        flex 1

      &>.lineheight
      &>.fontsize
      &>.font
        flex 1
        margin-left 5px
        .label
          flex 1
          width 30px
          line-height 30px
          text-align left
        .dropdown
          position relative
          flex 1
          .caret
            position absolute
            top 50%
            right 10px
          button
            width 100%
            height 30px
            padding-left 0px
            padding-right 0px
            background-color #454d53
            border 1px solid #2d353a
            border-radius 4px
          ul
            width 100%
            min-width 50px
            max-height 200px

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

      &.border
        .label
          max-width 60px
          flex 1
        .input-field
          max-width 80px
          flex 3

      &.pos
        .label
          max-width 30px
          flex 1
        .input-field
          max-width 100px
          flex 3

.ql-toolbar.ql-snow
  background-color #525861

  border none

.ql-container.ql-snow
  background-color #fff
  color #333
  font-size 1.4rem
  padding 10px
  width 100%
  height 150px
  border none
  resize none
  /*border 1px solid #2d353a*/
  /*background-color #454d53*/

.ql-toolbar .ql-formats
  button
    background-color transparent !important
    &:hover
      .ql-stroke
        stroke #eee
      background-color #333 !important
  .ql-stroke
    stroke #eee 
  .ql-picker-options
    .ql-stroke
      stroke #444
  .ql-picker
    &:hover
      background-color #333 !important
      .ql-stroke
        stroke #eee
  .ql-align
    &:hover
      .ql-picker-options
        .ql-stroke
          stroke #333 !important



    
  
</style>

<script>
import ElementHelper from '../../mixins/elementHelper'
import Slider from '../widgets/Slider.vue'
import ColorPicker from '../widgets/ColorPicker.vue'
import Dropdown from '../widgets/Dropdown.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import AnimationPanel from './AnimationPanel.vue'
import TriggerPanel from './TriggerPanel.vue'


export default {
  data() {
    return {
      editor: undefined,
      selectionRange: undefined,
      lineheights: [1, 1.2, 1.35, 1.5, 2, 2.5],
      fontsizes: [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36,40, 48, 56, 60, 72, 112, 144, 288, 576]
    }
  },
  mixins: [ElementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    bgcolor() {
      return this.element.get('bgcolor')
    },
    ftcolor() {
      return this.element.get('color')
    },
    fontbold() {
      return this.element.get('bold')
    },
    fontitalic() {
      return this.element.get('italic')
    },
    udl() {
      return this.element.get('udl')
    },
    textalign() {
      return this.element.get('textalign')
    },
    opacity: {
      get() {
        return this.percent(1 - this.element.get('opacity'))
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 100 ? 100 : value
        this.actions.setElement(
          this.elementid,
          {
            opacity: (100 - value) / 100
          })
        return value / 100
      }
    },
    rotate: {
      get() {
        return `${this.element.get('rotate')}度`
      },
      set(value) {
        value = parseInt(value, 10)
        value = value < 0 ? 0 : value
        value = value > 360 ? 360 : value
        this.actions.setElement(
          this.elementid,
          {
            rotate: value
          }
        )
      }
    },
    lineheight: {
      get() {
        return `${this.element.get('lineheight')}倍`
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          lineheight: parseFloat(value)
        })
      }
    },
    fontsize() {
      return this.element.get('size')
    },
    w: {
      get() {
        return this.px(this.element.get('w'))
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          w: parseInt(value)
        })
      }
    },
    x: {
      get() {
        return this.px(this.element.get('l'))
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          l: parseInt(value)
        })
      }
    },
    y: {
      get() {
        return this.px(this.element.get('t'))
      },
      set(value) {
        this.actions.setElement(this.elementid, {
          t: parseInt(value)
        })
      }
    }
  },
  methods: {
    setColor(value) {
      this.actions.setElement(this.elementid, {
        color: value
      })
    },
    setBgColor(value) {
      this.actions.setElement(this.elementid, {
        bgcolor: value
      })
    },
    setBold() {
      this.actions.setElement(this.elementid, {
        bold: !this.fontbold
      })
    },
    setItalic() {
      this.actions.setElement(this.elementid, {
        italic: !this.fontitalic
      })
    },
    setUdl() {
      this.actions.setElement(this.elementid, {
        udl: !this.udl
      })
    },
    setColorUndoable(value) {
      this.actions.setElement(this.elementid, {
        color: value
      })
    },
    setBgColorUndoable(value) {
      this.actions.setElement(this.elementid, {
        bgcolor: value
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
    setTextAlign(value) {
      this.actions.setElement(this.elementid, {
        textalign: value
      })
    },
    setOpacity(value) {
      this.actions.setElement(this.elementid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setOpacityUndoable(value) {
      this.actions.setElement(this.elementid, {
        opacity: Math.round((1 - value) * 100) / 100
      })
    },
    setLineheight(value) {
      this.actions.setElementUndoable(this.elementid, {
        lineheight: value
      })
    },
    setFontsize(value) {
      this.actions.setElementUndoable(this.elementid, {
        size: value
      })
    }
  },
  components: {
    'slider': Slider,
    'dropdown': Dropdown,
    'tabs': Tabset,
    'tab': Tab,
    'color-picker': ColorPicker,
    'animation-panel': AnimationPanel,
    'trigger-panel': TriggerPanel
  },
  ready() {
    $('.dropdown-menu').niceScroll({
      cursorcolor: '#d6d6d6',
      railalign: 'right',
      horizrailenabled: false,
      cursoropacitymin:0,
      autohidemode: false
    })
    
      
   

  }
}
</script>
