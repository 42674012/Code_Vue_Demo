<template lang="jade">
.animation-panel
  .panel-content
    .accordion.open(data-accordion)
      div(data-control)
        .panel-row(style="position: relative")
          .title 进入
          .caret
      div(data-content)
        .panel-row.speed
          .label 时间
          slider.slider(:min='0', :max='20000', :step='100', :value='parseFloat(animationinSpeed) * 1000',
          :startcb='setInSpeedUndoable',
          :slidecb='setInSpeed'
          )
          input.value(v-model='animationinSpeed', number, lazy)
        .panel-row.delay
          .label 延迟
          slider.slider(:min='0', :max='20000', :step='100', :value='parseFloat(animationinDelay) * 1000',
          :startcb='setInDelayUndoable',
          :slidecb='setInDelay'
          )
          input.value(v-model='animationinDelay', number, lazy)
        .panel-row.icons
          .block(v-for='(index, ani) in animationsinMap', @click='toggleAnimation(ani, "in")')
            .icon.in(:style='getIconPositionIn(index)', :class='{seleted: animationinEffect === ani.class}')
            .label {{ani.name}}
    .accordion(data-accordion)
      div(data-control)
        .panel-row(style="position: relative")
          .title 退出
          .caret
      div(data-content)
        .panel-row.speed
          .label 时间
          slider.slider(:min='0', :max='20000', :step='100', :value='parseFloat(animationoutSpeed) * 1000',
          :startcb='setOutSpeedUndoable',
          :slidecb='setOutSpeed'
          )
          input.value(v-model='animationoutSpeed', number, lazy)
        .panel-row.delay
          .label 延迟
          slider.slider(:min='0', :max='20000', :step='100', :value='parseFloat(animationoutDelay) * 1000',
          :startcb='setOutDelayUndoable',
          :slidecb='setOutDelay'
          )
          input.value(v-model='animationoutDelay', number, lazy)
        .panel-row.icons
          .block(v-for='(index, ani) in animationsoutMap', @click='toggleAnimation(ani, "out")')
            .icon.in(:style='getIconPositionOut(index)', :class='{seleted: animationoutEffect === ani.class}')
            .label {{ani.name}}
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.animation-panel
  .panel-row
    &.speed
    &.delay
      .label
        flex 1
        max-width 30px
      .slider
        flex 2
        max-width 150px
        margin-top 8px
      input
        flex 1
        max-width 50px
    .title
      flex 1
      text-align center
      height 30px
      line-height 30px
      color #fff
      background-color #2d353a
      border-radius 2px
    .caret
      position absolute
      top 50%
      right 20px


    &.icons
      flex-wrap wrap
      justify-content flex-start
      .label
        text-align center
      .icon
        width 62px
        height 62px
        margin auto
      .block
        width 62px
        /*margin-bottom 10px*/
      .block:hover
        cursor pointer
        &>.in
          background-image url(../../assets/images/animationsHighlight.png)
      .in
        background-image url(../../assets/images/animations.png)
        background-size 310px 248px
        &:hover
          background-image url(../../assets/images/animations.png)

      .seleted
        background-image url(../../assets/images/animationsHighlight.png)
        background-size 310px 248px

</style>

<script>
import '../../assets/animate.css'
import Slider from '../widgets/Slider.vue'
import { ELEMENT_ANIMATION_IN, ELEMENT_ANIMATION_OUT } from '../../models/animations'
import '../../vendors/jquery.accordion'

export default {
  name: 'animation-panel',
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      animation: this.element.getIn(['animation', 'in']) ? this.element.getIn(['animation', 'in', 'effect']) : '',
      animationsinMap: ELEMENT_ANIMATION_IN,
      animationsoutMap: ELEMENT_ANIMATION_OUT
    }
  },
  components: {
    'slider': Slider
  },
  computed: {
    animationinSpeed: {
      get() {
        return this.element.getIn(['animation', 'in', 'speed']) / 1000 + 's'
      },
      set(value) {
        value = parseFloat(value, 10)
        value = value < 0 ? 0 : value
        value = value > 20 ? 20 : value
        this.setInSpeedUndoable(value * 1000)
        return value * 1000
      }
    },
    animationinDelay: {
      get() {
        return this.element.getIn(['animation', 'in', 'delay'])/1000 + 's'
      },
      set(value) {
        value = parseFloat(value, 10)
        value = value < 0 ? 0 : value
        value = value > 20 ? 20 : value
        this.setInDelayUndoable(value * 1000)
        return value * 1000
      }
    },
    animationinEffect() {
      return this.element.getIn(['animation', 'in', 'effect'])
    },

    animationoutSpeed: {
      get() {
        return this.element.getIn(['animation', 'out', 'speed']) / 1000 + 's'
      },
      set(value) {
        value = parseFloat(value, 10)
        value = value < 0 ? 0 : value
        value = value > 20 ? 20 : value
        this.setOutSpeedUndoable(value * 1000)
        return value * 1000
      }
    },
    animationoutDelay: {
      get() {
        return this.element.getIn(['animation', 'out', 'delay'])/1000 + 's'
      },
      set(value) {
        value = parseFloat(value, 10)
        value = value < 0 ? 0 : value
        value = value > 20 ? 20 : value
        this.setOutDelayUndoable(value * 1000)
        return value * 1000
      }
    },
    animationoutEffect() {
      return this.element.getIn(['animation', 'out', 'effect'])
    }
  },
  methods: {
    toggleAnimation(ani, type) {
      let duration = parseFloat(this.animationinSpeed)
      let delay = parseFloat(this.animationinDelay)
      let selector = `[slugid="${this.elementid}"]`
      if (type === 'in') this.setInEffectUndoable(ani.class)
      else if (type === 'out') {
        this.setOutEffectUndoable(ani.class)
        duration = parseFloat(this.animationoutSpeed)
        delay = parseFloat(this.animationoutDelay)
      }
      let targetEle = $(selector)[0]
      let targetAnimateEle = $(targetEle).find('.outer-element')[0]

      // 点击无效果的处理
      if (ani.class === '') {
        $(targetAnimateEle).css({
          'animation':''
        }).removeClass('animated')
        $(selector).find('.operate').show()
        return
      }

      // 重复过快点击选择同一个动作的处理
      // we'll clone it, insert it right after itself, then remove the original.
      // if (this.animation === ani.class ) {
        /*let newone = targetAnimateEle.cloneNode(true)
        targetAnimateEle.parentNode.replaceChild(newone, targetAnimateEle)
        targetAnimateEle = newone*/
        /*$(targetAnimateEle).css({
          'animation': '' + 0+ 's ease ' + 0 + 's both',
          '-webkit-animation-play-state': 'reset',
          'animation-play-state': 'reset'
        }).addClass('animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (){
          $(targetAnimateEle).css({'animation':''}).removeClass('animated')
        }).stop(true, true)*/
      // }

      $(selector).find('.operate').hide()

      // 两方案共同遗留的问题是$('.operate').hide()和.show(),动画未播放完就去选择其他dom元素，
      // 会出现多个operate元素，可能需要在其他界面或对元素的操作上进行遍历去hide非选中的所有dom的operate

      /** 方案一：css() **/
      $(targetAnimateEle).css({
        'animation': ani.class + ' ' + duration + 's ease ' + delay + 's both',
        '-webkit-animation-play-state': 'running',
        'animation-play-state': 'running'
      }).addClass('animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (){
        $(targetAnimateEle).css({'animation':''})
        if (targetEle.classList.contains('active')) {
          $(selector).find('.operate').show()
        }
      })

      this.animation = ani.class
    },

    getIconPositionIn(index) {
      // 图片大小 310 * 248
      let x = -index * 62 % 310
      let y = -parseInt(index / 5) * 62
      return `background-position: ${x}px ${y}px`
    },

    getIconPositionOut(index) {
      // 图片大小 310 * 248
      let x = index === 0 ? 0 : -(index + 13) * 62 % 310
      let y = index === 0 ? 0 : -parseInt((index + 13) / 5) * 62
      return `background-position: ${x}px ${y}px`
    },
    // setInEffect(ani) {
    //   this.actions.setElement(this.elementid, {
    //     animation: {
    //       'in': {
    //         effect: ani
    //       }
    //     }
    //   })
    // },
    setInEffectUndoable(ani) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          in: {
            effect: ani
          }
        }
      })
    },
    setInSpeed(value) {
      this.actions.setElement(this.elementid, {
        animation: {
          in: {
            speed: value
          }
        }
      })
    },
    setInSpeedUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          in: {
            speed: value
          },
        }
      })
    },
    setInDelay(value) {
      this.actions.setElement(this.elementid, {
        animation: {
          in: {
            delay: value
          },
        }
      })
    },
    setInDelayUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          in: {
            delay: value
          },
        }
      })
    },
    setOutEffectUndoable(ani) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          out: {
            effect: ani
          }
        }
      })
    },
    setOutSpeed(value) {
      this.actions.setElement(this.elementid, {
        animation: {
          out: {
            speed: value
          }
        }
      })
    },
    setOutSpeedUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          out: {
            speed: value
          }
        }
      })
    },
    setOutDelay(value) {
      this.actions.setElement(this.elementid, {
        animation: {
          out: {
            delay: value
          }
        }
      })
    },
    setOutDelayUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        animation: {
          out: {
            delay: value
          }
        }
      })
    }
  },
  ready() {
    $('.accordion').accordion()
  }
}
</script>
