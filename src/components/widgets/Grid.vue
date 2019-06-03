<template lang="jade">
.grid-container(:style='gridStyle')
  .grid-row(v-el:gridrow v-for='row in rowsNum')
    .row-line-l(:style='rowLeftStyle(row)')
    .row-line(:style='gridRowsStyle(row)')
  .grid-col(v-el:gridcol, v-for='col in colsNum')
    .col-line-t(:style='colTopStyle(col)')
    .col-line(:style='gridColsStyle(col)')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.grid-container
  position absolute
  top 0
  left 0
  width 0
  height 0
  z-index 2000
  -webkit-user-drag none
  .grid-row
  .grid-col
    width 0
    height 0
    position absolute
    -webkit-user-drag none
  .row-line
  .row-line-l
  .col-line
  .col-line-t
    position absolute
    -webkit-user-drag none
  .row-line
    border-top 1px dashed #ccc
    oapcity 0.8
  .row-line-l
    left -5px
    border-top 1px solid #747373
    width 5px
  .col-line
    border-left 1px dashed #ccc
    oapcity 0.8
  .col-line-t
    top -5px
    height 5px
    border-left 1px solid #747373

</style>

<script>
import { SCALE } from '../../config'
import elementHelper from '../../mixins/elementHelper'
export default {
  name: 'grid',
  mixins: [elementHelper],
  data() {
    return {
      cols: 32,
      rows: 50
    }
  },
  computed: {
    gridStyle() {
        let w = 640 * SCALE
        let h = 1008 * SCALE
        return {
          left: '50%',
          top: '50%',
          marginLeft: this.px(-w/2),
          marginTop: this.px(-h/2)
        }
    },
    rowsNum() {
      let rowsNum = []
      // let rows = Math.ceil((1008 * SCALE)/10)
      for (var i = 0; i < this.rows; i++) {
        rowsNum[i] = i
      }
      return rowsNum
    },
    colsNum() {
      let colsNum = []
      // let cols = Math.ceil((640 * SCALE)/10)
      for (var i = 0; i < this.cols; i++) {
        colsNum[i] = i
      }
      return colsNum
    },
  },
  methods: {
    gridColsStyle(index) {
      let colwidth = 640 * SCALE / this.cols
      let style = {
        left: this.px(colwidth * (index + 1)),
        height: this.px(1008 * SCALE)
      }
      if (index === this.cols - 1) style.display = 'none'
      return style
    },
    colTopStyle(index) {
      let colwidth = 640 * SCALE / this.cols
      let style = {
        left: this.px(colwidth * (index))
      }
      if (index % 5 === 0) {
        style.top = '-10px'
        style.height = '10px'
      }
      return style
    },
    gridRowsStyle(index) {
      let rowheight = 1008 * SCALE / this.rows
      let style = {
        top: this.px(rowheight * (index + 1)),
        width: this.px(640 * SCALE)
      }
      if (index === this.rows - 1) style.display = 'none'
      return style
    },
    rowLeftStyle(index) {
      let rowheight = 1008 * SCALE / this.rows
      let style = {
        top: this.px(rowheight * (index))
      }
      if (index % 5 === 0) {
        style.left = '-10px'
        style.width = '10px'
      }
      return style
    }
  },
  ready() {
    // let vm = this
    // let gridCol = vm.$els.gridcol
    // let colLines = $(gridCol).children('.col-line')
    // for (var i = 0; i < colLines.length; i++) {
    //   colLines[i].style.left = this.px(10 * i)
    // }
  }
}
</script>
