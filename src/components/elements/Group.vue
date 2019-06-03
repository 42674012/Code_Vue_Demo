<template lang="jade">
.group-element
  .wrapper(:style='wrapperStyle')
    .handle-bar
    .handle-circle(v-el:handle)

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.group-element
  .wrapper
    position absolute
    border: 2px dashed #179ffe
    .handle-bar
      position absolute
      left 50%
      top -50px
      widht 2px
      height 50px
      margin-left -1px
      border-left 2px dashed #179ffe
    .handle-circle
      position absolute
      left 50%
      top -50px
      width 20px
      height 20px
      margin-left -10px
      border-radius 10px
      background-color #179ffe
      cursor move




</style>


<script>
import elementHelper from '../../mixins/elementHelper'
import { getGroupPosition } from '../../helpers/group'


export default {
  name: 'group-element',
  mixins: [elementHelper],
  props: ['state', 'actions'],
  data() {
    return {
    }
  },
  computed: {
    
    wrapperStyle() {
      let position = getGroupPosition(this.state)
      return {
        left: this.px(position.left),
        top: this.px(position.top),
        width: this.px(position.right - position.left),
        height: this.px(position.bottom - position.top)
      }
    }
  },
  methods: {
  },
  events: {
  },
  watch: {
  },
  components: {
  },
  ready() {
    let vm = this
    let start = {}

    $(this.$els.handle).on('movestart', e => {
      let elements = vm.state.getIn(['editorStatus', 'selectedElements'])
      elements.forEach(eid => {
        let el = vm.state.getIn(['elements', eid+''])
        start[eid] = {
          x: el.get('l'),
          y: el.get('t')
        }
        vm.actions.setElementUndoable(eid, {})
        return true
      })
    })

    $(this.$els.handle).on('move', e => {
      // 不允许移动的元素类型
      // if(MoveLimitEleType.indexOf(vm.element.get('type')) >= 0) {
      //   return
      // }
      // if(MoveLimitXEleType.indexOf(vm.element.get('type')) >= 0) {
      //   vm.actions.setElement(vm.elementid, {
      //     t: parseInt(start.y + e.distY)
      //   })
      //   return 
      // }
      let elements = vm.state.getIn(['editorStatus', 'selectedElements'])
      elements.forEach(eid => {
        vm.actions.setElement(eid, {
          l: parseInt(start[eid].x + e.distX),
          t: parseInt(start[eid].y + e.distY)
        })
      })
    })
  },
  destroyed() {
    $(this.$els.handle).off('movestart')
    $(this.$els.handle).off('move')
  }

}
</script>
