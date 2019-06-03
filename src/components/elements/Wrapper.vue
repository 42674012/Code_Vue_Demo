<template lang="jade">
div.wrapper-element(
  @mousedown='selectElement',
  @keydown.delete.stop='deleteElement',
  tabindex='0',
  v-show='!croppingPic',
  :style='wrapperStyle',
  :class='{active: selectedElementId === elementid}',
  :slugid='elementid')
  slot

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.wrapper-element
  position absolute
  cursor move
  outline none
  z-index 0

  /*&:hover
    border 1px solid rgba(0, 0, 0, 0.5)*/

  /*&.active:hover
    border 0px solid $grid-border-color*/

</style>

<script>
// import { SCALE } from '../../config'
import elementHelper from '../../mixins/elementHelper'
import keypress from '../../vendors/keypress'

const MoveLimitEleType = ['eleform', 'slide', 'fingerPrint', 'pEraser', 'header', 'footer']
const MoveLimitXEleType = ['post']
const noContextEle = []

function groupable(element) {
  return !~['header', 'footer'].indexOf(element.get('type')) 
}

export default {
  name: 'wrapper-element',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    selectedElement() {
      return this.state.getIn(['elements', this.selectedElementId+''])
    },
    selectedPageId() {
      return this.state.getIn(['editorStatus', 'selectedPageId'])
    },
    elementIdx() {
      let page = this.state.getIn(['pages', this.selectedPageId + ''])
      let elements = page.get('elements')
      let elementidx = elements.indexOf(this.selectedElementId)
      return elementidx
    },
    elementType() {
      return this.element.get('type')
    },
    numOfElements() {
      let page = this.state.getIn(['pages', this.selectedPageId + ''])
      let elements = page.get('elements').count()
      return elements
    },
    canvasHeight() {
      return this.state.getIn(['editorStatus', 'canvasHeight'])
    },
    wrapperStyle() {
      let page = this.state.getIn(['pages', this.selectedPageId + ''])
      let type = this.element.get('type')
      return {
        top: type === 'footer' ? this.px((page.get('ch') || this.canvasHeight) - 50) : this.px(this.element.get('t')),
        left: this.px(this.element.get('l')),
        width: this.px(this.element.get('w')),
        height: this.px(this.element.get('h')),
        transform: this.xRotate(this.element.get('rotate')),
        '-webkit-transform': this.xRotate(this.element.get('rotate')),
        '-moz-transform': this.xRotate(this.element.get('rotate')),
        '-ms-transform': this.xRotate(this.element.get('rotate'))
      }
    },
    croppingPic() {
      let cropping = this.state.getIn(['editorStatus', 'croppingPic'])
      if (cropping && this.elementType === 'pic' && this.elementid === cropping.get('id')) return true
      else return false
    }
  },
  methods: {
    selectElement(evt) {
      if (evt.ctrlKey || evt.metaKey) {
        if (groupable(this.element) && groupable(this.selectedElement)) this.actions.selectElements(this.elementid, this.element)
        else return
      } else this.actions.selectElement(this.elementid, this.element)
    },
    deleteElement() {
      this.actions.deleteElement(this.selectedElementId, this.selectedPageId)
    },
    copyElement() {
      this.actions.copyElement(this.selectedElement.merge({
        t: this.selectedElement.get('t') + 50,
        l: this.selectedElement.get('l') + 50
      }))
    },
    move(dx, dy) {
      dx = dx || 0
      dy = dy || 0
      let left = this.element.get('l')
      let top = this.element.get('t')
      if(MoveLimitEleType.indexOf(this.element.get('type')) >= 0)  return
      if(MoveLimitXEleType.indexOf(this.element.get('type')) >= 0) {
        this.actions.setElement(vm.elementid, {
          t: top + dy 
        })
        return 
      }
      this.actions.setElement(this.elementid, {
        l: left + dx,
        t: top + dy
      })
    },

    keyboardHandler(payload) {
      if (this.elementid === this.selectedElementId) {

        switch (payload.type) {
          case 'copy':
            this.copyElement()
            break
          case 'delete':
            this.deleteElement()
            break
          case 'up':
            this.move(0, -1)
            break
          case 'upup':
            this.move(0, -10)
            break
          case 'down':
            this.move(0, 1)
            break
          case 'downdown':
            this.move(0, 10)
            break
          case 'left':
            this.move(-1, 0)
            break
          case 'leftleft':
            this.move(-10, 0)
            break
          case 'right':
            this.move(1, 0)
            break
          case 'rightright':
            this.move(10, 0)
            break
          case 'above':
            this.reorderElement('up')
            break
          case 'top':
            this.reorderElement('top')
            break
          case 'under':
            this.reorderElement('down')
            break
          case 'bottom':
            this.reorderElement('bottom')
            break
          default:
            break
        }
      }
    },

    reorderElement(type) {
      switch (type) {
        case 'top':
          this.actions.reorderElement(
            this.selectedPageId,
            this.selectedElementId,
            this.numOfElements > 0 ? this.numOfElements : 0)
          break
        case 'bottom':
          this.actions.reorderElement(
            this.selectedPageId,
            this.selectedElementId,
            0)
          break
        case 'up':
          this.actions.reorderElement(
            this.selectedPageId,
            this.selectedElementId,
            this.elementIdx + 1)
          break
        case 'down':
          this.actions.reorderElement(
            this.selectedPageId,
            this.selectedElementId,
            this.elementIdx - 1)
          break
        default:
          break
      }

    }
  },
  ready() {
    let vm = this
    let start, matrix

    $(this.$el).on('movestart', e => {
      start = {
        x: vm.element.get('l'),
        y: vm.element.get('t')
      }
      vm.actions.setElementUndoable(vm.elementid, {})
    })

    $(this.$el).on('move', e => {
      //不允许移动的元素类型
      if(MoveLimitEleType.indexOf(vm.element.get('type')) >= 0) {
        return
      }
      if(MoveLimitXEleType.indexOf(vm.element.get('type')) >= 0) {
        vm.actions.setElement(vm.elementid, {
          t: parseInt(start.y + e.distY)
        })
        return 
      }
      vm.actions.setElement(vm.elementid, {
        l: parseInt(start.x + e.distX),
        t: parseInt(start.y + e.distY)
      })
    })

    if (noContextEle.indexOf(vm.element.get('type'))) {

      $.contextMenu({
        selector: `[slugid="${vm.elementid}"]`,
        animation: {duration: 0, show: 'show', hide: 'hide'},
        className: 'contextmenu-custom contextmenu-custom__highlight',
        items: {
          // crop: {
          //   name: '裁剪',
          //   disabled: () => vm.elementType != 'pic',
          //   callback: (key, opt) => {
          //     vm.cropElement()
          //   }
          // },
          copy: {
            name: '复制',
            disabled: () => vm.elementType === 'slide',
            callback: (key, opt) => {
              vm.copyElement()
            }
          },
          cut: {
            name: '剪贴',
            callback: (key, opt) => {
              vm.copyElement()
              vm.deleteElement()
            }
          },
          movetop: {
            name: '置顶',
            callback: (key, opt) => {
              vm.reorderElement('top')
            }
          },
          movebottom: {
            name: '置底',
            callback: (key, opt) => {
              vm.reorderElement('bottom')
            }
          },
          moveup: {
            name: '上移一层',
            disabled: () => vm.elementIdx === vm.numOfElements - 1,
            callback: (key, opt) => {
              vm.reorderElement('up')
            }
          },
          movedown: {
            name: '下移一层',
            disabled: () => vm.elementIdx === 0,
            callback: (key, opt) => {
              vm.reorderElement('down')
            }
          },
          delete: {
            name: '删除',
            callback: (key, opt) => {
              vm.deleteElement()
            }
          },
        }
      })
    }


    this.$on('KEYBOARD_EVENT', this.keyboardHandler)
  },


  destroyed() {
    $.contextMenu('destroy', `[slugid="${this.elementid}"]`)
  }
}
</script>
