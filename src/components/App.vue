<template lang="jade">
div
  template(v-if="state.getIn(['editorStatus', 'isFetching']) === true")
      loading
  template(v-else)
    .container-fluid(@mousedown='onWindowMousedown')
      .row.body-container(v-events-control)
        navbar(:state='state', :actions='actions')
        .left-container
          navigator-panel(:state='state', :actions='actions')
          canvas-area(:state='state', :actions='actions')
        .right-container
          control-panel(:state='state', :actions='actions')
          canvas-toolbar(:state='state', :actions='actions', :showgrid.sync='showGrid')
  piclib(:state='state', :actions='actions', :scenario='showPicScenario', :show.sync='showPicLib')
  shapelib(:state='state', :actions='actions', :scenario='showShapeScenario', :show.sync='showShapeLib')

  link-modal(:state='state', :actions='actions', :payload='showLinkModalPayload', :show.sync='showLinkModal')
  preview(:state='state', :actions='actions', :show.sync='showPagePreview')


</template>

<style lang="stylus">

html
  font-size 62.5%

body
  font-size 1.2rem
  -webkit-font-smoothing antialiased

  button,
  input
    outline none !important

html, body
  width 100%
  height 100%
  overflow hidden
  // -webkit-user-select none
  // -moz-user-select none

#editor, .container-fluid, .body-container
  height 100%

.body-container
  background-color $bg
  border 1px solid $grid-border
  .left-container
    position absolute
    left 0
    top 60px
    bottom 0
    right 300px
    overflow hidden
    z-index 101
  .right-container
    position absolute
    top 60px
    bottom 0
    width 300px
    right 0
    // overflow hidden
    /*background-color #3e464c*/
    background-color #2a313e
    z-index 102


.contextmenu-custom.contextmenu-custom__highlight
  width 100px
  min-width 100px
  border-radius 3px
  border 0px
  opacity 0.9
  box-shadow 0 2px 5px rgba(0, 0, 0, 0.5)
  .context-menu-item
    padding 3px 21px
    color #000000
    &.context-menu-hover
      padding 3px 21px
      color #000000
      background-color #179ffe
    &.context-menu-disabled
      opacity 0.5


</style>

<script>
import '../assets/iconfont.css'
import Immutable from 'immutable'
import configureStore from '../store'
import * as actions from '../actions'
import reduxMixinsCreator from '../mixins/reduxMixins'
import Loading from './widgets/Loading.vue'
import Navbar from './navbar/Navbar.vue'
import NavPanel from './navpanel/NavigatorPanel.vue'
import Canvas from './canvas/CanvasArea.vue'
import ControlPanel from './controlpanel/ControlPanel.vue'
import CanvasToolbar from './canvas/CanvasToolbar.vue'
import PicLib from './shared/PicLib.vue'
import ShapeLib from './shared/ShapeLib.vue'
import LinkModal from './shared/LinkModal.vue'
import Preview from './shared/Preview.vue'

// import TestBar from './TestBar.vue'
// import Modal from './widgets/TipsModal.vue'
import keypress from '../vendors/keypress'

const store = configureStore({})
const reduxMixins = reduxMixinsCreator(actions)




export default {
  el() {
    return '#editor';
  },
  mixins: [reduxMixins],
  data() {
    return {
      store,
      showModal: false,
      showPicLib: false,
      showShapeLib: false,
      showPicScenario: null,
      showShapeScenario: null,
      showLinkModal: false,
      showLinkModalPayload: null,
      showPagePreview: false
    }
  },
  computed: {
    jsonString() {
      return JSON.stringify(this.state.get('pages').toJS())
    }
    // showTemplateLib() {
    //   return this.state.getIn(['editorStatus', 'showTemplateLib'])
    // }
  },
  events: {
    // 图片剪裁事件
    'CROP_IMAGE': function (pl) {
      this.$broadcast('CROP_IMAGE', pl)
    },
    // 打开图库事件
    'SHOW_PICLIB': function (pl) {
      // this.$broadcast('SHOW_PICLIB', pl)
      this.showPicScenario = pl && pl.scenario
      this.showPicLib = true
    },
    // 打开页面预览事件
    'SHOW_PAGE_PREVIEW': function (pl) {
      this.showPagePreview = true
    },
    // 打开形状库事件
    'SHOW_SHAPELIB': function (pl) {
      // this.$broadcast('SHOW_SHAPELIB', pl)
      this.showShapeScenario = pl && pl.scenario
      this.showShapeLib = true
    },
    // 打开链接模态窗
    'SHOW_LINKMODAL': function (pl) {
      this.showLinkModalPayload = Object.assign({}, pl)
      this.showLinkModal = true
    },
    'DUPLICATE_PAGE': function (pl) {
      this.$broadcast('DUPLICATE_PAGE', pl)
    },
    'DUPLICATE_SAVE': function (pl) {
      this.$broadcast('DUPLICATE_SAVE', pl)
    }
  },
  methods: {
    onWindowMousedown(e) {
      this.$broadcast('WINDOW_MOUSEDOWN', {event: e})
    },
    // onKeyUp(e) {
    //   console.log(e)
    // }
  },
  components: {
    loading: Loading,
    navbar: Navbar,
    'navigator-panel': NavPanel,
    'canvas-area': Canvas,
    'control-panel': ControlPanel,
    'canvas-toolbar': CanvasToolbar,
    piclib: PicLib,
    shapelib: ShapeLib,
    'link-modal': LinkModal,
    preview: Preview
  },
  created() {
    window.audio = new Audio()
    this.actions.fetchSiteData()
    // this.actions.fetchJson()
    // this.actions.fetchChartModels()

    //  auto save
    // setInterval(function () {
    //   this.$broadcast('AUTO_SAVE', {type: 'autosave'})
    // }.bind(this), 3 * 60 * 1000)


    // keyboard event
    const listener = new keypress.Listener()
    listener.register_combo({
      'prevent_default': true,
      // 'is_exclusive': true
    })
    listener.register_many([
      // 项目层级
      {
        'keys': ['meta', 's'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'save'})}
      },
      {
        'keys': ['meta', 'z'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'undo'})}
      },
      {
        'keys': ['meta', 'y'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'redo'})}
      },
      //元素层级
      {
        'keys': ['meta', 'c'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'copy'})}
      },
      {
        'keys': ['meta', 'v'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'paste'})}
      },
      {
        'keys': ['delete'],
        'on_keydown': (e) => {
          this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'delete'})}
      },
      {
        'keys': ['backspace'],
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'delete'})}
      },
      {
        'keys': ['shift', 'up'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'upup'})}
      },
      {
        'keys': ['up'],
        'is_exclusive': true,
        'on_keyup': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'up'})}
      },
      {
        'keys': ['shift', 'down'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'downdown'})}
      },
      {
        'keys': ['down'],
        'is_exclusive': true,
        'on_keyup': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'down'})}
      },
      {
        'keys': ['shift', 'left'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'leftleft'})}
      },
      {
        'keys': ['left'],
        'is_exclusive': true,
        'on_keyup': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'left'})}
      },
      {
        'keys': ['shift', 'right'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'rightright'})}
      },
      {
        'keys': ['right'],
        'is_exclusive': true,
        'on_keyup': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'right'})}
      },
      {
        'keys': ['alt', ']'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'top'})}
      },
      {
        'keys': ['meta', ']'],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'above'})}
      },
      {
        'keys': ['alt', '['],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'bottom'})}
      },
      {
        'keys': ['meta', '['],
        'is_exclusive': true,
        'on_keydown': (e) => {this.$broadcast('KEYBOARD_EVENT', {event: e, type: 'under'})}
      }
    ])
  }

}
</script>
