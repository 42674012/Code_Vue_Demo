<template lang="jade">
.slides-panel
  tabs.tabs
    tab(header='设置')
      .panel-content

        .panel-row
          .label 播放方式
          dropdown.dropdown
            button.btn.btn-default(data-toggle='dropdown') {{playMode}}
              div.caret.pull-right
            ul.dropdown-menu(slot='dropdown-menu')
              li(v-for='i in playModes')
                a(href='#', @click='selectPlayMode(i)') {{i.label}}
        
        .panel-row.interval
          .label 切换时长 
          slider.slider(:min='0', :max='10', :step='1', :value='parseInt(interval)',
          :startcb='setOpacityUndoable',
          :slidecb='setOpacity')
          input.value(v-model='interval', number, lazy)

        .panel-row.text-toggle
          .label 显示图片描述
          toggle(:value='textOn', id='cb1', :callback='toggleText', style='width: 50px')

        .panel-row.dots-toggle
          .label 显示轮播点 
          toggle(:value='dotsOn', id='cb2', :callback='toggleDots', style='width: 50px')
        
        .panel-row.line

        .panel-row.slides-wrap
          .slide-wrap(v-for='slide in slides.toJS()', :class='{active: $index===activeIndex}', @click='setActiveSlide($index)')
            img(:src='slide.url')
            .delete
            i.iconfont.icon-cuowu(@click='deleteSlide($index)')

          .slide-wrap.slide-add(v-if='slides.size < 8', @click='addSlide')
            i.iconfont.icon-tianjia
        .panel-row.crop-area
          image-crop(:element='element', :ratio='{x: element.get("w"), y: element.get("h")}',
          :startcb='setCropUndoable',
          :cropcb='setCrop',
          :changeslide='changeSlide')

        .panel-row.text(v-if='activeSlide && textOn')
          .label(style="width: 60px;") 描述 
          input(type='text', v-model='text', lazy, style='text-align: left')

        .panel-row.link(v-if='activeSlide')
          .checkbox-wrap
            input(type='checkbox',v-model='triggerOn')
            .label 链接
          .link-content(v-show='activeSlide.getIn(["trigger", "on"])', :title='activeSlide.getIn(["trigger", "v"])')
            span {{activeSlide.getIn(['trigger', 'v'])}}
          button.btn.btn-default.bianji(style='width: 30px; height: 30px;', v-show='activeSlide.getIn(["trigger", "on"])', @click="toggleLinkModal($index)")
            i.iconfont.icon-bianji

        .panel-row.line

        .panel-row.size(style='margin-top: 20px')
          .label 大小
          .input-field
            input.value(v-model='h', number, lazy)
            .label 长
          .input-field
            input.value(v-model='w', number, lazy)
            .label 宽
        .panel-row.pos
          .label 位置
          .input-field
            input.value(v-model='x' lazy)
            .label X
          .input-field
            input.value(v-model='y' lazy)
            .label Y
        
    tab(header='动作')
      animation-panel(
      :state='state',
      :actions='actions',
      :elementid='elementid',
      :element='element'
      )
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.slides-panel
  .panel-row
    &.slides-wrap
      justify-content flex-start
      flex-wrap wrap
      .slide-wrap
        position relative
        flex 1
        max-width 60px
        min-width 60px
        height 60px
        margin-right 5px
        margin-bottom 5px
        line-height 60px
        border 1px solid #000
        overflow hidden
        text-align center
        cursor pointer
        img
          max-width 60px
          max-height 60px
        i
          font-size 2.5rem
        .delete
          display none
          position absolute
          top 0
          left 0
          width 100%
          height 20px
          background-color #000
          opacity 0.6
        i.icon-cuowu
          display none
          position absolute
          top 0
          right 0
          width 20px
          height 20px
          line-height 20px
          font-size 1.5rem
          color #fff

        &:hover
          .delete
          i.icon-cuowu
            display block
      

      .slide-add  
        border 1px dashed #0e85ff
        color #0e85ff
      
      .active
        background-color #0e85ff

    &.link
      input[type='checkbox']
        margin 0
        width 20px
      .link-content
        width 160px
        border-radius 4px
        height 30px
        line-height 30px
        background-color #fff 
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .checkbox-wrap
        width 50px
        height 30px
        .label 
          float right
          line-height 30p

    &.dots-toggle
      justify-content space-between

    &.interval
      .label
        // flex 1 0 40px
        flex-basis 60px
      .slider
        flex 2
        max-width 150px
        margin-top 8px
      input
        flex-basis 40px 
        color #000

    &.pos
    &.size
      .label
        max-width 30px
        flex 1
      .input-field
        color #000
        max-width 100px
        flex 3
    .dropdown
      .caret
        position absolute
        top 50%
        right 10px
      button
        width 100px
        height 30px
        border none
      .dropdown-menu
        width 100px
      li>a:hover
        background-color: #179eff

    &.crop-area
      width 260px
      height 290px
      margin 10px auto 0px auto
      background-color #fff

    .label
      color #fff
    input
      background-color #fff
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Slider from '../widgets/Slider.vue'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import ImageCrop from '../widgets/ImageCropSlides.vue'
import AnimationPanel from './AnimationPanel.vue'
import Dropdown from '../widgets/Dropdown.vue'
import ToggleButton from '../widgets/ToggleButton.vue'

import config from '../../config'

export default {
  name: 'slides-panel',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      playModes: [
        {
          value: true,
          label: '自动滑动'
        },
        {
          value: false,
          label: '手动滑动'
        }
      ],
    }
  },
  computed: {
    slides() {
      return this.element.get('slides')
    },
    activeIndex() {
      return this.element.get('active')
    },
    activeSlide() {
      return this.element.getIn(['slides', this.element.get('active') + ''])
    },
    playMode() {
      return this.element.get('autoPlay') ? '自动滑动' : '手动滑动'
    },
    dotsOn() {
      return this.element.get('dots')
    },
    textOn() {
      return this.element.get('text')
    },
    interval: {
      get() {
        return this.element.get('interval') + 's' 
      },
      set(value) {
        value = parseInt(value, 10)
        return value
      }
    },
    x: {
      get() {
        return this.px(this.element.get('l'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          l: parseInt(value) || 0
        })
      }
    },
    y: {
      get() {
        return this.px(this.element.get('t'))
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          t: parseInt(value) || 0
        })
      }
    },
    w: {
      get() {
        return this.px(this.element.get('w'))
      },
      set(value) {
        let pic = this.picProcess(parseInt(value) || 0, this.element.get('h'), false)
        this.actions.setElementUndoable(this.elementid, pic)
      }
    },
    h: {
      get() {
        return this.px(this.element.get('h'))
      },
      set(value) {
        let pic = this.picProcess(this.element.get('w'), parseInt(value) || 0, true)
        this.actions.setElementUndoable(this.elementid, pic)
      }
    },
    text: {
      get() {
        return this.activeSlide.get('text')
      },
      set(val) {
        this.onChange({text: val})
      }
    },
    triggerOn: {
      get() {
        return this.activeSlide.getIn(['trigger', 'on'])
      },
      set(val) {
        let trigger = this.activeSlide.get('trigger')
        trigger = trigger.merge({on: val})
        this.onChange({trigger: trigger.toJS()})
      }
    }
  },
  methods: {
    addSlide() {
      this.$dispatch('SHOW_PICLIB', {scenario: 'ADD_SLIDE'})
    },
    deleteSlide(index) {
      let slides = this.slides.toJS()
      if (slides.length <= 1) return
      slides.splice(index, 1)
      this.actions.setElementUndoable(this.elementid, {
        slides: undefined
      })
      this.actions.setElement(this.elementid, {
        slides: slides,
        active: index - 1 > 0 ? index -1 : 0
      })
    },
    changeSlide() {
      this.$dispatch('SHOW_PICLIB', {scenario: 'CHANGE_SLIDE'})
    },
    setActiveSlide(index) {
      this.actions.setElement(this.elementid, {
        active: index
      })
    },
    setCrop(value) {
      let payload = {
        crop: value.crop,
        iw: value.iw,
        ih: value.ih,
        il: value.il,
        it: value.it
      }
      let slides = this.slides.toJS()
      let active = this.element.get('active')
      let slide = this.activeSlide.merge(payload).toJS()
      slides.splice(active, 1, slide)

      this.actions.setElement(this.elementid, {
        slides: slides
      })
    },
    setCropUndoable(value) {
      // let payload = {
      //   crop: value.crop,
      //   w: value.w,
      //   h: value.h,
      //   l: value.l,
      //   t: value.t
      // }
      this.actions.setElementUndoable(this.elementid, {})
    },
    selectPlayMode(mode) {
      this.actions.setElementUndoable(this.elementid, {
        autoPlay: mode.value
      })
    },
    setOpacity(value) {
      this.actions.setElement(this.elementid, {
        interval: value 
      })
    },
    setOpacityUndoable(value) {
      this.actions.setElementUndoable(this.elementid, {
        interval: value
      })
    },
    toggleDots(val) {
      this.actions.setElementUndoable(this.elementid, {
        dots: val
      })
    },
    toggleText(val) {
      this.actions.setElementUndoable(this.elementid, {
        text: val
      })
    },
    toggleLinkModal() {
      this.$dispatch('SHOW_LINKMODAL', {
        elementid: this.elementid,
        element: this.element,
        callback: (p) => {
          this.onChange({
            trigger: {
              t: p.linkType,
              v: p.linkValue 
            }
          })
        }
      })
    },
    onChange(payload) {
      console.log(payload)
      let slides = this.slides.toJS()
      let active = this.element.get('active')
      let slide = this.activeSlide.merge(payload).toJS()
      slides.splice(active, 1, slide)
      this.actions.setElement(this.elementid, {
        slides: slides
      })

    }
  },
  components: {
    'slider': Slider,
    'tabs': Tabset,
    'tab': Tab,
    'animation-panel': AnimationPanel,
    'image-crop': ImageCrop,
    'dropdown': Dropdown,
    'toggle': ToggleButton

  }

}
</script>
