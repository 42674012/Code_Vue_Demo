<template lang="jade">
.wrapper(:style='wrapperStyle')
    .outer(:style='outerStyle')
      .inner(:style="innerStyle")
        button.btn.btn-default.submit(:style='buttonStyle') {{btnText}}
        .lists(v-for='list in lists.toJS()')
          input.list(:placeholder='getPlaceHolder(list)', type='text', :style='inputStyle')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.wrapper
  position absolute
.outer
  position absolute
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  overflow hidden
  .inner
    position relative
    overflow hidden
    .list
      width 100%
      height 50px
      padding-left 10px
      margin-bottom 20px
      border 1px solid #626263
      border-radius 4px
      font-size 2.6rem

    .submit
      position absolute
      left 0px
      bottom 0px
      width 100%
      min-width 80px
      height 50px
      color #fff
      font-size 2.6rem
</style>

<script>
import elementHelper from '../../mixins/elementHelper'

export default {
  name: 'form-preview',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  computed: {
    lists() {
      return this.element.get('lists')
    },
    wrapperStyle() {
      return {
        left: this.px(this.element.get('l')),
        top: this.px(this.element.get('t')),
        width: this.px(this.element.get('w')),
        height: this.px(this.element.get('h'))
      }
    },
    innerStyle() {
      return {
        flexBasis: this.px(this.element.get('w') * 0.7),
        width: this.px(this.element.get('w') * 0.7),
        height: this.px(this.element.get('h') * 0.7)
      }
    },
    outerStyle() {
      return {
        opacity: this.element.get('opacity'),
        // borderColor: this.element.get('bordercolor'),
        borderRadius: this.px(this.element.get('borderradius') * this.element.get('h') / 200),
      }
    },
    inputStyle() {
      return {
        color: this.element.get('fontcolor')
      }
    },
    buttonStyle() {
      return {
        backgroundColor: this.element.get('btncolor')
      }
    },
    btnText() {
      return this.element.get('btntext')
    },
    selectedElementId() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
  },
  methods: {
    getPlaceHolder(list) {
      let ph = list.label
      if (list.required) ph += '*'
      return ph
    }

  }
}
</script>
