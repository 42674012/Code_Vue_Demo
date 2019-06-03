<template lang="jade">
.wrapper-preview(:style='style')
  .text-preview(v-html='element.get("con")', v-el:text)

</template>

<style lang="stylus">
.wrapper-preview
  position absolute
  .text-preview
    p
      margin 0

</style>

<script>
import elementHelper from '../../mixins/elementHelper'


export default {
  name: 'text-preview',
  mixins: [elementHelper],
  data() {
    return {
    }
  },
  props: ['element'],
  computed: {
    h() {
      let lines = 1
      if (this.$els.text) {
        lines = this.$els.text.children.length
        lines = lines === 0 ? 1 : lines
      }
      return this.element.get('size') * this.element.get('lineheight') * lines
    },
    style() {
      return {
        top: this.px(this.element.get('t')),
        left: this.px(this.element.get('l')),
        width: this.px(this.element.get('w')),
        // height: this.px(this.element.get('h')),
        // fontFamily: this.element.get('fontId'),
        color: this.element.get('color'),
        fontSize: this.px(this.element.get('size')),
        fontWeight: this.element.get('bold') ? 'bold' : 'normal',
        fontStyle: this.element.get('italic') ? 'italic' : 'normal',
        fontDecoration: this.element.get('url') ? 'underline' : 'none',
        lineHeight: this.element.get('lineheight'),
        textAlign: this.element.get('textalign'),
        opacity: this.element.get('opacity'),
        wordWrap: 'break-word',
        borderRadius: this.px(this.element.get('borderradius') * this.h / 200),
        // boxShadow: `0 0 ${this.px(this.element.get('boxshadow'))} #000`,
        transform: this.xRotate(this.element.get('rotate'))
      }
    }
  }
}
</script>
