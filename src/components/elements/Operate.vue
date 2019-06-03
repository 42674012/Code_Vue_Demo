<template lang="jade">
.operate
  .border-line
  .proxy
  .scale.scale-nw(v-if='isShowCornerHandler')
  .scale.scale-ne(v-if='isShowCornerHandler')
  .scale.scale-sw(v-if='isShowCornerHandler')
  .scale.scale-se(v-if='isShowCornerHandler')

  .scale.scale-n(v-if='isShowHeightHandler')
  .scale.scale-e(v-if='isShowWidthHandler')
  .scale.scale-s(v-if='isShowHeightHandler')
  .scale.scale-w(v-if='isShowWidthHandler')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.operate-wrapper
  position relative
  width 100%
  height 100%

.operate-no
  width 100%
  height 100%
  border solid 2px $text-level-1

.operate
  width 100%
  height 100%

  &:before
  &:after
    content ''
    position absolute
    width 100%
    border-top 1px dashed black
    left 0

  &:before
    top 0

  &:after
    bottom 0

  .border-line:before
  .border-line:after
    content ''
    position absolute
    height 100%
    border-left 1px dashed black
    top 0

  .border-line:before
    left 0
  .border-line:after
    right 0

  .scale
    position absolute
    background #179ffe
    border 1px solid #000
    width 10px
    height 10px
    z-index 1

  .scale-nw
    top -8px
    left -8px
    cursor nw-resize

  .scale-ne
    top -8px
    right -8px
    cursor ne-resize

  .scale-sw
    bottom -8px
    left -8px
    cursor sw-resize

  .scale-se
    bottom -8px
    right -8px
    cursor se-resize

  .scale-n
    top -5px
    left 50%
    margin-left -5px
    cursor n-resize

  .scale-e
    top 50%
    right -5px
    margin-top -5px
    cursor e-resize
  .scale-e-text
    width 16px
    height 16px
    top 50%
    right -8px
    margin-top -8px
    border-radius 50%
    cursor e-resize

  .scale-s
    bottom -5px
    left 50%
    margin-left -5px
    cursor s-resize

  .scale-w
    top 50%
    left -5px
    margin-top -5px
    cursor w-resize
  .scale-w-text
    width 16px
    height 16px
    top 50%
    left -8px
    margin-top -8px
    border-radius 50%
    cursor w-resize



</style>

<script>
import * as Transform from '../../helpers/transform'
export default {
  name: 'operate',
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      start: {}
    }
  },
  computed: {
    scale() {
      // return this.state.getIn(['editorStatus', 'viewportScale'])
      return 1 
    },
    theta() {
      if (this.element.get('rotate')) {
        return parseInt(this.element.get('rotate'), 10)
      } else {
        return 0
      }
    },
    etype() {
      return this.element.get('type')
    },
    selectedDom() {
      return $(`[slugid="${this.elementid}"] img`)
    },
    isShowCornerHandler() {
      return ['text', 'post', 'header', 'footer'].indexOf(this.etype) === -1
    },
    isShowHeightHandler() {
      return ['text', 'post', 'header', 'footer'].indexOf(this.etype) === -1
    },
    isShowWidthHandler() {
      return ['post', 'header', 'footer'].indexOf(this.etype) === -1
    }
  },
  methods: {
    movestart(e) {
      e.stopPropagation()
      let h = this.element.get('h') ? this.element.get('h') : this.$el.offsetHeight
      let inh = this.selectedDom.height()
      this.$set('start', {
        left: this.element.get('l'),
        top: this.element.get('t'),
        h: h,
        w: this.element.get('w'),
        inw: this.etype === 'pic' ? this.element.get('iw') : undefined,
        // inh: this.etype === 'pic' ? this.element.get('inh') : undefined,
        inh: this.etype === 'pic' ? inh : undefined,
        inleft: this.etype === 'pic' ? this.element.get('il') : undefined,
        intop: this.etype === 'pic' ? this.element.get('it') : undefined,
        // 中心点
        x0: this.element.get('l') + this.element.get('w') / 2,
        y0: this.element.get('t') + h / 2,
        // 图片元素中心焦点相对背景图片的比例
        wr: (this.element.get('w') / 2 - this.element.get('il')) / this.element.get('iw'),
        // hr: (h / 2 - this.element.get('intop')) / this.element.get('inh'),
        hr: (h / 2 - this.element.get('it')) / inh

      })
      this.actions.setElementUndoable(this.elementid, {})
    },

    move(e, type) {
      e.stopPropagation()
      let point = [e.distX / this.scale, e.distY / this.scale]
      let polarpoint = Transform.xy2polar(point[0], point[1], 0, 0)
      let nextEl

      switch (type) {
        case 'n':
          nextEl = this.moveN(point)
          break
        case 'ne':
          nextEl = this.moveNE(polarpoint)
          break
        case 'e':
          nextEl = this.moveE(point)
          break
        case 'se':
          nextEl = this.moveSE(polarpoint)
          break
        case 's':
          nextEl = this.moveS(point)
          break
        case 'sw':
          nextEl = this.moveSW(polarpoint)
          break
        case 'w':
          nextEl = this.moveW(point)
          break
        case 'nw':
          nextEl = this.moveNW(polarpoint)
          break
        default:
          break
      }

      if (nextEl.w && nextEl.w <= 10 || nextEl.h && nextEl.h <= 10) {
        return
      }
      for (let k in nextEl) {
        nextEl[k] = parseInt(nextEl[k], 10)
      }
      // 文字元素不需要设置高度
      if (this.etype === 'text') nextEl.h = undefined
      nextEl.crop = {
        l: parseInt(-nextEl.il / nextEl.iw * this.element.get('nw')),
        t: parseInt(-nextEl.it / nextEl.ih * this.element.get('nh')),
        w: parseInt(nextEl.w / nextEl.iw * this.element.get('nw')),
        h: parseInt(nextEl.h / nextEl.ih * this.element.get('nh'))
      }
      this.actions.setElement(this.elementid, nextEl)

    },

    moveN(point) {
      let w1 = this.start.w
      let h1 = this.start.h - point[1]
      // x01 y01 是拉伸后的中心点
      let x01 = this.start.x0 - point[1] / 2 * Transform.sin(this.theta)
      let y01 = this.start.y0 + point[1] / 2 * Transform.cos(this.theta)
      // x5 y5 为东南顶点，根据其在旋转后的坐标不变，对应求出旋转前的坐标
      let x5 = this.start.left + this.start.w
      let y5 = this.start.top + this.start.h
      let result = Transform.trans1(x5, y5, this.start.x0, this.start.y0, x01, y01, this.theta)
      let nextEl = {
        l: result.x - this.start.w,
        t: result.y - h1,
        h: h1
      }
      nextEl = this.picProcess2(nextEl, w1, h1, true)
      return nextEl
    },
    moveE(point) {
      let w1 = this.start.w + point[0]
      let h1 = this.start.h
      // x01 y01 是拉伸后的中心点
      let x01 = this.start.x0 + point[0] / 2 * Transform.cos(this.theta)
      let y01 = this.start.y0 + point[0] / 2 * Transform.sin(this.theta)
      // 根据初始西北顶点在旋转后的坐标不变，对应求出旋转前的坐标
      let result = Transform.trans1(this.start.left, this.start.top, this.start.x0, this.start.y0, x01, y01, this.theta)
      let left1 = result.x
      let top1 = result.y

      let nextEl = {
        l: left1,
        t: top1,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess2(nextEl, w1, h1, false)
      return nextEl
    },
    moveS(point) {
      let w1 = this.start.w
      let h1 = this.start.h + point[1]
      // x01 y01 是拉伸后的中心点
      let x01 = this.start.x0 - point[1] / 2 * Transform.sin(this.theta)
      let y01 = this.start.y0 + point[1] / 2 * Transform.cos(this.theta)
      let result = Transform.trans1(this.start.left, this.start.top, this.start.x0, this.start.y0, x01, y01, this.theta)
      let left1 = result.x
      let top1 = result.y
      let nextEl = {
        l: left1,
        t: top1,
        h: h1,
        w: w1
      }
      nextEl = this.picProcess2(nextEl, w1, h1, true)
      return nextEl
    },
    moveW(point) {
      let w1 = this.start.w - point[0]
      let h1 = this.start.h
      // x01 y01 是拉伸后的中心点
      let x01 = this.start.x0 + point[0] / 2 * Transform.cos(this.theta)
      let y01 = this.start.y0 + point[0] / 2 * Transform.sin(this.theta)
      // x5 y5 为东南顶点，根据其在旋转后的坐标不变，对应求出旋转前的坐标
      let x5 = this.start.left + this.start.w
      let y5 = this.start.top + this.start.h
      let result = Transform.trans1(x5, y5, this.start.x0, this.start.y0, x01, y01, this.theta)
      let nextEl = {
        l: result.x - w1,
        t: result.y - this.start.h,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess2(nextEl, w1, h1, false)
      return nextEl
    },
    moveNE(point) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(this.start.left, this.start.top, this.start.x0, this.start.y0)
      let r1 = result.r
      let theta1 = 540 - result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = this.start.h - dr * Transform.sin(theta1)
      let w1 = this.start.w + dr * Transform.cos(theta1)
      let x7 = this.start.left
      let y7 = this.start.top + this.start.h
      result = Transform.trans2(x7, y7, this.start.x0, this.start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x,
        t: result.y - h1,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess(nextEl, w1, h1)
      return nextEl
    },
    moveSE(point) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(this.start.left, this.start.top, this.start.x0, this.start.y0)
      let r1 = result.r
      let theta1 = result.theta - 180
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = this.start.h + dr * Transform.sin(theta1)
      let w1 = this.start.w + dr * Transform.cos(theta1)
      let x1 = this.start.left
      let y1 = this.start.top
      result = Transform.trans2(x1, y1, this.start.x0, this.start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x,
        t: result.y,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess(nextEl, w1, h1)
      return nextEl
    },
    moveSW(point) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(this.start.left, this.start.top, this.start.x0, this.start.y0)
      let r1 = result.r
      let theta1 = -result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = this.start.h + dr * Transform.sin(theta1)
      let w1 = this.start.w - dr * Transform.cos(theta1)
      let x3 = this.start.left + this.start.w
      let y3 = this.start.top
      result = Transform.trans2(x3, y3, this.start.x0, this.start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x - w1,
        t: result.y,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess(nextEl, w1, h1)
      return nextEl
    },
    moveNW(point) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(this.start.left, this.start.top, this.start.x0, this.start.y0)
      let r1 = result.r
      let theta1 = result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = this.start.h - dr * Transform.sin(theta1)
      let w1 = this.start.w - dr * Transform.cos(theta1)
      let x5 = this.start.left + this.start.w
      let y5 = this.start.top + this.start.h
      result = Transform.trans2(x5, y5, this.start.x0, this.start.y0, dr / 2, this.theta)
      let nextEl =  {
        l: result.x - w1,
        t: result.y - h1,
        w: w1,
        h: h1
      }
      nextEl = this.picProcess(nextEl, w1, h1)
      return nextEl
    },
    picProcess(el, w1, h1) {
      if (this.etype === 'pic') {
        let inw1 = this.start.inw * (w1 / this.start.w)
        let inh1 = this.start.inh * (h1 / this.start.h)
        let inleft1 = w1 * (this.start.inleft / this.start.w)
        let intop1 = h1 * (this.start.intop / this.start.h)
        el.iw = inw1
        el.ih = inh1
        el.il = inleft1
        el.it = intop1
      }
      return el
    },
    picProcess2(el, w1, h1, vertical) {
      if (this.etype === 'pic') {

        let inw1, inh1, inleft1, intop1
        if (vertical) {
          inh1 = this.start.hr < 0.5 ? h1 / 2 / this.start.hr : h1 / 2 / (1 - this.start.hr)
          inw1 = inh1 * this.start.inw / this.start.inh
          inleft1 = w1 / 2 - inw1 * this.start.wr
          intop1 = h1 / 2 - inh1 * this.start.hr
          if (inleft1 > 0 || inleft1 + inw1 < w1) {
            inw1 = this.start.wr < 0.5 ? w1 / 2 / this.start.wr : w1 / 2 / (1 - this.start.wr)
            inh1 = inw1 * this.start.inh / this.start.inw
            inleft1 = w1 / 2 - inw1 * this.start.wr
            intop1 = h1 / 2 - inh1 * this.start.hr
          }
        } else {
          inw1 = this.start.wr < 0.5 ? w1 / 2 / this.start.wr : w1 / 2 / (1 - this.start.wr)
          inh1 = inw1 * this.start.inh / this.start.inw
          inleft1 = w1 / 2 - inw1 * this.start.wr
          intop1 = h1 / 2 - inh1 * this.start.hr
          if (intop1 > 0 || intop1 + inh1 < h1) {
            inh1 = this.start.hr < 0.5 ? h1 / 2 / this.start.hr : h1 / 2 / (1 - this.start.hr)
            inw1 = inh1 * this.start.inw / this.start.inh
            inleft1 = w1 / 2 - inw1 * this.start.wr
            intop1 = h1 / 2 - inh1 * this.start.hr
          }
        }
        el.iw = inw1
        el.ih = inh1
        el.il = inleft1
        el.it = intop1

      }
      return el
    }
  },
  ready() {
    $(this.$el).find('.scale').on('movestart', this.movestart)
    $(this.$el).find('.scale-n').on('move', e => this.move(e, 'n'))
    $(this.$el).find('.scale-ne').on('move', e => this.move(e, 'ne'))
    $(this.$el).find('.scale-e').on('move', e => this.move(e, 'e'))
    $(this.$el).find('.scale-e-text').on('move', e => this.move(e, 'e'))
    $(this.$el).find('.scale-se').on('move', e => this.move(e, 'se'))
    $(this.$el).find('.scale-s').on('move', e => this.move(e, 's'))
    $(this.$el).find('.scale-sw').on('move', e => this.move(e, 'sw'))
    $(this.$el).find('.scale-w').on('move', e => this.move(e, 'w'))
    $(this.$el).find('.scale-w-text').on('move', e => this.move(e, 'w'))
    $(this.$el).find('.scale-nw').on('move', e => this.move(e, 'nw'))
  }
}
</script>
