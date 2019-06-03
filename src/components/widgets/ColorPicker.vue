<template lang="jade">
.color-picker
  input(type='text')
</template>

<style lang="stylus">
@import '../../variables.styl'
@import '../../../node_modules/spectrum-colorpicker/spectrum.css'

.color-picker
  .sp-replacer
    border none
    border-radius 5px
    margin 0
    padding 0
    border 1px solid #000

  .sp-preview
    margin 0
    box-shadow inset 0px 1px 2px 0px rgba(0, 0, 0, 0.5)
    width 32px
    height 30px
    border none
    background-image none

    .sp-preview-inner.sp-clear-display
      background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAAS1JREFUWAnt2L0SgjAMAODU82dxcMP38gHc4Xlw590cYNM7Fx1E0xMPsEVKk7QDWUp7XPuRZgmqfgdEHIuIbZo2A31vaM7gmAzWtxs8igJw7MeyvyA9R9Q9z6GuKn30+njsEIJescadThqn9ntYHQ4dHE6CAb+4sgTEbdIU1HYbB3AsLkgGXXDiQFecKHAKTgw4FScC9MGxA31xrEAKHBuQCscCpMSRA6lxpEAOHBmQC0cC5MR5A7lxXkAJ3GSgFG4SUBLnDJTGOQFD4BA4qu3UuE9rONTg4IbU8ber6+CSxNp9UcOa/QaBP7gsM7aGzWYcoxUYAw4/2AiMBWcHXi5QX6+gsOYCXGu7VJTtF/DzfAa124nXXBuHz1Zg/8VQc2MNhsKYzp2Bpqy4rL0A/PoZmt+FISAAAAAASUVORK5CYII=")
      background-size 100% 100%

  .sp-dd
    display none

.color-picker-container
  background-color #313131
  border 0px
  height 300px

  .sp-picker-container
    width 210px

    .sp-color
    .sp-clear
    .sp-hue
      border none

    .sp-input
      font-size 1.2rem
      color #83817b
      background-color #212121
      border-radius 0px
      border 1px solid #83817b

    .sp-clear
      background-image url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAAS1JREFUWAnt2L0SgjAMAODU82dxcMP38gHc4Xlw590cYNM7Fx1E0xMPsEVKk7QDWUp7XPuRZgmqfgdEHIuIbZo2A31vaM7gmAzWtxs8igJw7MeyvyA9R9Q9z6GuKn30+njsEIJescadThqn9ntYHQ4dHE6CAb+4sgTEbdIU1HYbB3AsLkgGXXDiQFecKHAKTgw4FScC9MGxA31xrEAKHBuQCscCpMSRA6lxpEAOHBmQC0cC5MR5A7lxXkAJ3GSgFG4SUBLnDJTGOQFD4BA4qu3UuE9rONTg4IbU8ber6+CSxNp9UcOa/QaBP7gsM7aGzWYcoxUYAw4/2AiMBWcHXi5QX6+gsOYCXGu7VJTtF/DzfAa124nXXBuHz1Zg/8VQc2MNhsKYzp2Bpqy4rL0A/PoZmt+FISAAAAAASUVORK5CYII=")
      background-size 100% 100%

  .sp-palette-container
    position absolute
    border 0px
    width 210px
    bottom 0px
    z-index 1

    .sp-thumb-el
      width 19px
      height 19px
      border 0

</style>

<script>
import 'spectrum-colorpicker'

export default {
  name: 'color-picker',
  props: ['color', 'startcb', 'movecb', 'stopcb', 'key'],
  methods: {
    move(color) {
      this.movecb && this.movecb(color ? color.toString() : '', this.key)
    },
    change(color) {
      this.startcb && this.startcb(color ? color.toString() : '', this.key)
    },
    dragstart(e, color) {
      this.startcb && this.startcb(color ? color.toString() : '', this.key)
    },
    dragstop(e, color) {
      this.stopcb && this.stopcb(color ? color.toString() : '', this.key)
    },
    show(color) {
      let colorpicker = $('.color-picker-container:not(.sp-hidden)')
      let top = colorpicker.css('top')
      colorpicker.css('top', parseInt(top, 10) + 10)
      this.startcb && this.startcb(color ? color.toString() : '', this.key)
    }
  },
  watch: {
    color(color) {
      $(this.$el).find('input').spectrum('set', this.color)
    }
  },
  ready() {
    $(this.$el).find('input').spectrum({
      color: this.color,
      showInput: true,
      allowEmpty: true,

      containerClassName: 'color-picker-container',
      // showAlpha: true,
      preferredFormat: 'hex',
      move: this.move,
      // change: this.change,
      show: this.show,
      showPalette: true,
      clickoutFiresChange: false,
      showSelectionPalette: false,
      hideAfterPaletteSelect: false,
      showButtons: false,
      palette: [
        ['#FFFFFF', '#E3E4E5', '#21D4D8', '#1292B3', '#00BEF2', '#69CEF5', '#4993C8', '#0062B8', '#6666FF', '#7749F5'],
        ['#9621C1', '#CC29B1', '#F41484', '#F074AC', '#F16C74', '#48E0C3', '#42C2B3', '#0C9467', '#17A53C', '#7ED321'],
        ['#B7D989', '#F4F47A', '#F7DF00', '#DDB208', '#CC6D1F', '#F97F2D', '#FC532B', '#E01E36', '#545454', '#000000']
      ]
    })
    // $(this.$el).find('input').on('dragstart.spectrum', this.dragstart)
    $(this.$el).find('input').on('dragstop.spectrum', this.dragstop)

    $('.color-picker-container').on('keydown', e => e.stopPropagation())
    $('.color-picker-container').on('keyup', e => e.stopPropagation())
  },
  destroyed() {
    $(this.$el).find('input').spectrum('destroy')
    $('.color-picker-container').remove()
  }
}
</script>
