<template lang="jade">
.outer-element(:style='outerStyle', :slugid='elementid')
  slot
</template>

<style lang="stylus" scoped>
.outer-element
  position absolute
  width 100%
  height 100%
  overflow hidden
</style>

<script>
import elementHelper from '../../mixins/elementHelper'

export default {
  name: 'outer-element',
  mixins: [elementHelper],
  props: ['elementid', 'element'],
  computed: {
    outerStyle() {
      return {
        fontFamily: this.element.get('fontId'),
        color: this.element.get('ftcolor'),
        fontSize: this.px(this.element.get('ftsize')),
        fontWeight: this.element.get('fontbold') ? 'bold' : 'normal',
        fontStyle: this.element.get('fontitalic') ? 'italic' : 'normal',
        fontDecoration: this.element.get('url') ? 'underline' : 'none',
        lineHeight: this.element.get('lineheight'),
        textAlign: this.element.get('textalign'),
        opacity: this.element.get('opacity'),
        wordWrap: 'break-word',
        backgroundColor: this.element.get('bgcolor'),
        borderColor: this.element.get('border-color'),
        borderStyle: this.element.get('border-style'),
        borderWidth: this.element.get('border-width'),
        borderRadius: this.element.get('borderradius') + '%',
        boxShadow: this.px(this.element.get('boxshadow'))
      }
    }
  }
}
</script>