<template lang='jade'>
.footer-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row.color
          .label 文字图标颜色
          color-picker.colorpicker(:color='fontcolor', :startcb='setFontColorUndoable', :movecb='setFontColor')
        .panel-row.color
          .label 背景颜色
          color-picker.colorpicker(:color='bgcolor', :startcb='setBgColorUndoable', :movecb='setBgColor')
        .panel-row.label-toggle
          .label 显示文字
          toggle(:value='labelOn', :callback='toggleLabel', style='width: 170px')
        .panel-row.line
        .panel-row
          .label 添加菜单
          button.btn.btn-default.add(@click='addMenu')
            i.fa.fa-plus
        .iconpicker-container
        div(style='margin-bottom: 20px', v-for='menu in menus')
          .panel-row.menus
            //
              .btn-group
                button.btn.btn-default.iconpicker-component.menu(type='button')
                  i.fa(:class='menu.icon')
                button.btn.btn-default.icp.icp-dd.dropdown-toggle(type='button', :data-selected="menu.icon", data-toggle="dropdown")
                  span.caret
                .dropdown-menu
            .form-group
              button.btn.btn-default.icp.menu(@click='showIconpicker($index)')
                i.fa(:class='menu.icon')
            .label 文字
            input(type='text', v-model='menu.label', lazy, @change='onChange')
            button.btn.btn-default.add(@click='deleteMenu($index)')
              i.fa.fa-minus
          .panel-row.link
            .checkbox-wrap
              input(type='checkbox',v-model='menu.trigger.on', lazy, @change='onChange')
              .label 链接
            .link-content(v-show='menu.trigger.on',:title="menu.trigger.v") {{menu.trigger.v}}
            button.btn.btn-default.bianji(style='width: 30px; height: 30px;', v-show='menu.trigger.on' @click="toggleLinkModal($index)")
              i.iconfont.icon-bianji

</template>

<style lang="stylus">
@import '../../variables.styl'

.footer-panel
  input
    color #000 !important
    background-color #fff !important
    text-align left !important


  button
    max-width 40px
    min-width 40px
    height 40px
    &.add
      background-color #1a212e
      border 1px dashed #0385f3
      color #0385f3
      font-size 20px 
    &.menu
    &.dropdown-toggle
      background-color #1a212e
      // border 1px solid #0385f3
      font-size 20px 

  .selected-icon
    background-color #0385f3
  .iconpicker-container
    position relative
  .iconpicker-popover
    position absolute !important
    left 40px !important


  .iconpicker-item
    i
      color #000

  .menus
    input
      width 120px

  .link
    input[type='checkbox']
      margin 0
      width 20px
    .link-content
      width 160px
      border-radius 4px
      height 30px
      line-height 30px
      background-color #fff 
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
import ElementHelper from '../../mixins/elementHelper'
import ColorPicker from '../widgets/ColorPicker.vue'
import ToggleButton from '../widgets/ToggleButton.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import TriggerPanel from './TriggerPanel.vue'



import '../../vendors/fapicker/fontawesome-iconpicker.min.js'
import '../../vendors/fapicker/fontawesome-iconpicker.min.css'

export default {
  data() {
    return {
      // menus:[]
      // showLink: true
    }
  },
  mixins: [ElementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    bgcolor() {
      return this.element.get('bgcolor')
    },
    fontcolor() {
      return this.element.get('fontcolor')
    },
    labelOn() {
      return this.element.get('labelOn')
    },
    menus() {
      return this.element.get('menus').toJS()
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
    toggleLabel(val) {
      this.actions.setElementUndoable(this.elementid, {
        labelOn: val
      })
    },
    addMenu() {
      if (this.menus.length >= 5) return
      this.menus.push({
        icon: 'fa-home',
        label: '主页',
        trigger: {
          on: true,
          t: 2, // 1 - 站外, 2 - 站内 
          v: ''
        }
      })
      this.actions.setElementUndoable(this.elementid, {
        menus: this.menus 
      })

    },
    deleteMenu(index) {
      if (this.menus.length <= 1) return
      this.menus.splice(index, 1)
      this.actions.setElement(this.elementid, {
        menus: null 
      })
      this.actions.setElementUndoable(this.elementid, {
        menus: this.menus
      })
    },
    onChange(val) {
      this.actions.setElementUndoable(this.elementid, {
        menus: this.menus
      })
    },
    toggleLinkModal(index) {
      this.$dispatch('SHOW_LINKMODAL', {
        elementid: this.elementid,
        element: this.element,
        callback: (p) => {
          this.menus[index].trigger.t = p.linkType 
          this.menus[index].trigger.v = p.linkValue 
          this.actions.setElementUndoable(this.elementid, {
            menus: this.menus
          })
        }
      })
    },

    linkContent() {
      return this.element.getIn(['trigger', 'v'])
    },
    
    showIconpicker(index) {
      this.index = index
      $('.footer-panel .iconpicker-container').iconpicker({
        placement: 'inline',
        hideOnSelect: true,
        selectedCustomClass: 'selected-icon',
        container: '.iconpicker-container'
      }).data('iconpicker').show()
    }

  },
  components: {
    'tabs': Tabset,
    'tab': Tab,
    'color-picker': ColorPicker,
    'toggle': ToggleButton,
    'trigger-panel': TriggerPanel
  },
  ready() {
    // $('.footer-panel .icp-dd').iconpicker({
    //   selectedCustomClass: 'selected-icon',
    //   // hideOnSelect: true,
    //   // showFooter: true,
    //   // templates: {
    //   //   popover: '<div class="iconpicker-popover popover">' +
    //   //       '<div class="popover-title"></div><div class="popover-content"></div></div>',
    //   //   footer: '<div class="popover-footer"></div>',
    //   //   buttons: '<button class="iconpicker-btn iconpicker-btn-cancel btn btn-default btn-sm">Cancel</button>' +
    //   //       ' <button class="iconpicker-btn iconpicker-btn-accept btn btn-primary btn-sm">Accept</button>',
    //   // }
    // })
      $('.iconpicker-container').on('iconpickerSelected', (e) => {
        console.log(e.iconpickerValue)
        this.menus[this.index].icon = e.iconpickerValue
        this.actions.setElementUndoable(this.elementid, {
          menus: this.menus
        })
      })
  }
}
</script>
