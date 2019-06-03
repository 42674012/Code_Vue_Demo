<template lang="jade">
div
</template>

<style lang="stylus">
@import '../../vendors/jquery-ui.css'
@import '../../variables.styl'

.ui-slider
  height 4px
  border none
  border-radius 2px
  background-color #2d353a
  position relative
  top 4px
  outline 0
  -webkit-touch-callout none

.ui-slider-range,
.ui-widget-header,
.ui-slider-range-min
  background-color #5a6267
  background-image none

.ui-slider-handle,
.ui-slider a,
.ui-slider .ui-slider-handle
  background-color #5a6267
  box-shadow 0px 2px 4px 0px rgba(0, 0, 0, 0.5)
  background-image none
  outline none
  width 16px
  height 16px
  border-radius 100%
  top -8px

</style>

<script>

export default {
  name: 'slider',
  props: ['min', 'max', 'step', 'value', 'startcb', 'slidecb'],
  methods: {
    onStart(e, ui) {
      this.startcb(ui.value)
    },
    onSlide(e, ui) {
      this.slidecb(ui.value)
    }
  },
  watch: {
    value(newValue) {
      $(this.$el).slider('option', 'value', newValue)
    }
  },
  ready() {
    $(this.$el).slider({
      min: this.min,
      max: this.max,
      step: this.step || 1,
      range: 'min',
      value: this.value,
      start: this.onStart,
      change: this.onChange,
      slide: this.onSlide,
    })
  },
}
</script>
