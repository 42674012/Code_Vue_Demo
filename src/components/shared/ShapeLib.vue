<template lang="jade">
modal.shapelib(:show.sync='show', effect='fade', :width='860')
  div(slot='modal-header')
    .modal-header
      span.title 形状库
      button.btn.btn-default.pull-right(@click='toggleCategoryGroup("extension")', :class='{active: activeCategory==="extension"}') 扩展形状
      button.btn.btn-default.pull-right(@click='toggleCategoryGroup("basic")', :class='{active: activeCategory==="basic"}') 基础形状
  div(slot='modal-body')
    .modal-body
      .shapes
        .shape-item(v-for='shape in shapes', @click='selectShape(shape)', tabindex='0')
          .shape(v-html='svg(shape.value)')

  div(slot='modal-footer')
    .modal-footer
      button.btn.btn-default.confirm(@click='confirmAction()') 确定
      button.btn.btn-default(@click='close()') 取消

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.shapelib
  color #545454
  .modal-header
    .title
      font-size 2rem
    .btn
      width 100px
      margin-left 20px
      border-radius 10px
      border none
      background-color #ccc
      &.active
        color #fff
        background-color #545454
  .modal-body
    height 400px
    .shapes
      display flex
      flex-wrap wrap
      align-content flex-start
      width 100%
      height 100%
      background-color #eee
      overflow-y scroll
      .shape-item
        flex 1
        max-width 100px
        max-height 100px
        min-width 100px
        min-height 100px
        margin 10px 8px
        outline none
        &:focus
          border 2px solid #179eff
  .modal-footer
    .btn
      width 100px
    .confirm
      background-color #545454
      color #fff


</style>

<script>
import Modal from '../widgets/Modal.vue'
import config from '../../config'
import {SHAPE_MODEL} from '../../models/data'
import {SHAPE_MAP_BASIC, SHAPE_MAP_EXT} from '../../models/shapes'

export default {
  name: 'shapelib',
  props: ['state', 'actions', 'scenario', 'show'],
  data() {
    return {
      slugid: this.state.getIn(['editorStatus', 'slugId']),
      shapes: SHAPE_MAP_BASIC,
      selectedShape: undefined,
      activeCategory: 'basic'
    }
  },
  computed: {

  },
  methods: {
    selectShape(shape) {
      this.selectedShape = shape
    },
    svg(markup) {
      let svg = $(`<div>${markup}</div>`)
      svg.find('svg')
      .attr('preserveAspectRatio', 'none meet')
      .css({
        width: '100%',
        height: '100%'
      })
      return svg.html()
    },
    confirmAction() {
      console.debug(this.scenario)
      switch (this.scenario) {
        case 'ADD_SHAPE':
          this.addShape()
          break
        case 'CHANGE_SHAPE':
          this.changeShape()
          break
        default:
          this.addShape()
          break
      }
    },
    addShape() {
      if (this.selectedShape) {
        let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
        let slugid = this.state.getIn(['editorStatus', 'slugId'])

        this.actions.addElement(Object.assign({}, SHAPE_MODEL, {
          t: document.getElementsByClassName('canvas-window-wrapper')[0].scrollTop,
          shape: this.selectedShape.name,
          colors: this.selectedShape.colors
        }), pageid, slugid)
        this.close()
      }
    },
    changeShape() {
      let elementid = this.state.getIn(['editorStatus', 'selectedElementId'])
      if (this.selectedShape) {
        this.actions.setElement(elementid, {
          shape: this.selectedShape.name,
          colors: this.selectedShape.colors
        })
        this.close()
      }
    },
    toggleCategoryGroup(group) {
      this.activeCategory = group
      if (group === 'basic') {
        this.shapes = SHAPE_MAP_BASIC
      } else if (group === 'extension') {
        this.shapes = SHAPE_MAP_EXT
      }
    },
    close() {
      this.show = false
    }
  },
  components: {
    modal: Modal
  },
  ready() {
    $('.shapelib .shapes').niceScroll({
      cursorcolor: '#545454',
      cursorborder: '0px',
      cursorwidth: 5,
      autohidemode: false,
      horizrailenabled: false
    })

  }
}

</script>
