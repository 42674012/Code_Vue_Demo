<template lang="jade">
.toggle
  input.tgl.tgl-light(:id='id || "cb"', type='checkbox', v-model='value')
  label.tgl-btn(:for='id || "cb"')

</template>

<style lang="stylus">
@import '../../variables.styl'

.tgl
  display none
  &, &:after, &:before,
  & *, & *:after, & *:before,
  & + .tgl-btn
    box-sizing: border-box;
    &::selection
      background: none;

  & + .tgl-btn
    outline 0
    display block
    width 4em
    height 2em
    position relative
    cursor pointer
    user-select none
    &:after, &:before
      position relative
      display block
      content ''
      width 50%
      height 100%
    &:after
      left: 0
    &:before
      display none
  &:checked
    & + .tgl-btn
      &:after
        left 50%

.tgl-light
  & + .tgl-btn
    background $toggle-btn-background-off
    border-radius 2em
    padding 2px
    transition all .4s ease
    &:after
      border-radius 50%
      background #ffffff
      transition all .2s ease
  &:checked
    & + .tgl-btn
      background $toggle-btn-background-on

</style>

<script>
export default {
  name: 'toggle',
  props: ['value', 'callback', 'id'],
  watch: {
    value(val) {
      this.callback(val)
    }
  }
}
</script>