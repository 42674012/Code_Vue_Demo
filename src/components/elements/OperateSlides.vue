<template lang="jade">
.operate
  .border-line
  .proxy
  .scale.scale-nw
  .scale.scale-ne
  .scale.scale-sw
  .scale.scale-se

  .scale.scale-n
  .scale.scale-e
  .scale.scale-s
  .scale.scale-w



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
    width 12px
    height 12px
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
      start: []
    }
  },
  computed: {
    scale() {
      return this.state.getIn(['editorStatus', 'viewportScale'])
    },
    theta() {
      if (this.element.get('rotate')) {
        return parseInt(this.element.get('rotate'), 10)
      } else {
        return 0
      }
    },
    slides() {
      return this.element.get('slides')
    },
    selectedDom() {
      return $(`[slugid="${this.elementid}"] img`)
    }
  },
  methods: {
    movestart(e) {
      e.stopPropagation()
      this.start = []

      let h = this.element.get('h') ? this.element.get('h') : this.$el.offsetHeight
      this.slides.forEach((slide) => {
        // inh = slide.get('inh')
        this.start.push({
          left: this.element.get('l'),
          top: this.element.get('t'),
          h: h,
          w: this.element.get('w'),
          inw: slide.get('iw'),
          inh: slide.get('ih'),
          inleft: slide.get('il'),
          intop: slide.get('it'),
          // 中心点
          x0: this.element.get('l') + this.element.get('w') / 2,
          y0: this.element.get('t') + h / 2,
          // 图片元素中心焦点相对背景图片的比例
          wr: (this.element.get('w') / 2 - slide.get('il')) / slide.get('iw'),
          hr: (h / 2 - slide.get('it')) / slide.get('ih')

        })
      });

      this.actions.setElementUndoable(this.elementid, {})
    },

    move(e, type) {
      e.stopPropagation()
      let point = [e.distX / this.scale, e.distY / this.scale]
      let polarpoint = Transform.xy2polar(point[0], point[1], 0, 0)
      let nextEl, nextElSlide

      // 调整元素框
      switch (type) {
        case 'n':
          nextEl = this.moveN(point, this.start[0])
          break
        case 'ne':
          nextEl = this.moveNE(polarpoint, this.start[0])
          break
        case 'e':
          nextEl = this.moveE(point, this.start[0])
          break
        case 'se':
          nextEl = this.moveSE(polarpoint, this.start[0])
          break
        case 's':
          nextEl = this.moveS(point, this.start[0])
          break
        case 'sw':
          nextEl = this.moveSW(polarpoint, this.start[0])
          break
        case 'w':
          nextEl = this.moveW(point, this.start[0])
          break
        case 'nw':
          nextEl = this.moveNW(polarpoint, this.start[0])
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
      this.actions.setElement(this.elementid, nextEl)

      // 调整框内图片
      let slides = this.slides.toJS()
      this.start.forEach((start, i) => {
        switch (type) {
          case 'n':
            nextElSlide = this.picProcess2(start, start.w, start.h - point[1], true)
            break
          case 'ne':
            nextElSlide = this.picProcess(start, nextEl.w, nextEl.h)
            break
          case 'e':
            nextElSlide = this.picProcess2(start, start.w + point[0], start.h, false)
            break
          case 'se':
            nextElSlide = this.picProcess(start, nextEl.w, nextEl.h)
            break
          case 's':
            nextElSlide = this.picProcess2(start, start.w, start.h + point[1], true)
            break
          case 'sw':
            nextElSlide = this.picProcess(start, nextEl.w, nextEl.h)
            break
          case 'w':
            nextElSlide = this.picProcess2(start, start.w - point[0], start.h, false)
            break
          case 'nw':
            nextElSlide = this.picProcess(start, nextEl.w, nextEl.h)
            break
          default:
            break
        }

        let slide = slides[i]
        Object.assign(slide, {
          it: parseInt(nextElSlide.it),
          il: parseInt(nextElSlide.il),
          ih: parseInt(nextElSlide.ih),
          iw: parseInt(nextElSlide.iw),
        })
        slide.crop.l = parseInt(-slide.il / slide.iw * slide.nw)
        slide.crop.t = parseInt(-slide.it / slide.ih * slide.nh)
        slide.crop.w = parseInt(this.element.get('w') / slide.iw * slide.nw)
        slide.crop.h = parseInt(this.element.get('h') / slide.ih * slide.nh)
        slides.splice(i, 1, slide)
      })

      // this.actions.setElement(this.elementid, {
      //   slides: undefined
      // })
      this.actions.setElement(this.elementid, {
        slides: slides
      })

    },

    moveN(point, start) {
      let w1 = start.w
      let h1 = start.h - point[1]
      // x01 y01 是拉伸后的中心点
      let x01 = start.x0 - point[1] / 2 * Transform.sin(this.theta)
      let y01 = start.y0 + point[1] / 2 * Transform.cos(this.theta)
      // x5 y5 为东南顶点，根据其在旋转后的坐标不变，对应求出旋转前的坐标
      let x5 = start.left + start.w
      let y5 = start.top + start.h
      let result = Transform.trans1(x5, y5, start.x0, start.y0, x01, y01, this.theta)
      let nextEl = {
        l: result.x - start.w,
        t: result.y - h1,
        h: h1,
      }
      return nextEl
    },
    moveE(point, start) {
      let w1 = start.w + point[0]
      let h1 = start.h
      // x01 y01 是拉伸后的中心点
      let x01 = start.x0 + point[0] / 2 * Transform.cos(this.theta)
      let y01 = start.y0 + point[0] / 2 * Transform.sin(this.theta)
      // 根据初始西北顶点在旋转后的坐标不变，对应求出旋转前的坐标
      let result = Transform.trans1(start.left, start.top, start.x0, start.y0, x01, y01, this.theta)
      let left1 = result.x
      let top1 = result.y

      let nextEl = {
        l: left1,
        t: top1,
        w: w1
      }
      return nextEl
    },
    moveS(point, start) {
      let w1 = start.w
      let h1 = start.h + point[1]
      // x01 y01 是拉伸后的中心点
      let x01 = start.x0 - point[1] / 2 * Transform.sin(this.theta)
      let y01 = start.y0 + point[1] / 2 * Transform.cos(this.theta)
      let result = Transform.trans1(start.left, start.top, start.x0, start.y0, x01, y01, this.theta)
      let left1 = result.x
      let top1 = result.y
      let nextEl = {
        l: left1,
        t: top1,
        h: h1
      }
      return nextEl
    },
    moveW(point, start) {
      let w1 = start.w - point[0]
      let h1 = start.h
      // x01 y01 是拉伸后的中心点
      let x01 = start.x0 + point[0] / 2 * Transform.cos(this.theta)
      let y01 = start.y0 + point[0] / 2 * Transform.sin(this.theta)
      // x5 y5 为东南顶点，根据其在旋转后的坐标不变，对应求出旋转前的坐标
      let x5 = start.left + start.w
      let y5 = start.top + start.h
      let result = Transform.trans1(x5, y5, start.x0, start.y0, x01, y01, this.theta)
      let nextEl = {
        l: result.x - w1,
        t: result.y - start.h,
        w: w1
      }
      return nextEl
    },
    moveNE(point, start) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(start.left, start.top, start.x0, start.y0)
      let r1 = result.r
      let theta1 = 540 - result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = start.h - dr * Transform.sin(theta1)
      let w1 = start.w + dr * Transform.cos(theta1)
      let x7 = start.left
      let y7 = start.top + start.h
      result = Transform.trans2(x7, y7, start.x0, start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x,
        t: result.y - h1,
        w: w1,
        h: h1
      }
      return nextEl
    },
    moveSE(point, start) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(start.left, start.top, start.x0, start.y0)
      let r1 = result.r
      let theta1 = result.theta - 180
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = start.h + dr * Transform.sin(theta1)
      let w1 = start.w + dr * Transform.cos(theta1)
      let x1 = start.left
      let y1 = start.top
      result = Transform.trans2(x1, y1, start.x0, start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x,
        t: result.y,
        w: w1,
        h: h1
      }
      // nextEl = this.picProcess(nextEl, w1, h1)
      return nextEl
    },
    moveSW(point, start) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(start.left, start.top, start.x0, start.y0)
      let r1 = result.r
      let theta1 = -result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = start.h + dr * Transform.sin(theta1)
      let w1 = start.w - dr * Transform.cos(theta1)
      let x3 = start.left + start.w
      let y3 = start.top
      result = Transform.trans2(x3, y3, start.x0, start.y0, dr / 2, this.theta)
      let nextEl = {
        l: result.x - w1,
        t: result.y,
        w: w1,
        h: h1
      }
      return nextEl
    },
    moveNW(point, start) {
      let r0 = point.r
      let theta0 = point.theta
      let result = Transform.xy2polar(start.left, start.top, start.x0, start.y0)
      let r1 = result.r
      let theta1 = result.theta
      let dr = r0 * Transform.cos(theta1 - theta0)
      let h1 = start.h - dr * Transform.sin(theta1)
      let w1 = start.w - dr * Transform.cos(theta1)
      let x5 = start.left + start.w
      let y5 = start.top + start.h
      result = Transform.trans2(x5, y5, start.x0, start.y0, dr / 2, this.theta)
      let nextEl =  {
        l: result.x - w1,
        t: result.y - h1,
        w: w1,
        h: h1
      }
      return nextEl
    },

    picProcess(start, w1, h1) {
      let inw1 = start.inw * (w1 / start.w)
      let inh1 = start.inh * (h1 / start.h)
      let inleft1 = w1 * (start.inleft / start.w)
      let intop1 = h1 * (start.intop / start.h)

      return {
        iw: inw1,
        ih: inh1,
        il: inleft1,
        it: intop1
      }
    },

    picProcess2(start, w1, h1, vertical) {
      let inw1, inh1, inleft1, intop1
      if (vertical) {
        inh1 = start.hr < 0.5 ? h1 / 2 / start.hr : h1 / 2 / (1 - start.hr)
        inw1 = inh1 * start.inw / start.inh
        inleft1 = w1 / 2 - inw1 * start.wr
        intop1 = h1 / 2 - inh1 * start.hr
        if (inleft1 > 0 || inleft1 + inw1 < w1) {
          inw1 = start.wr < 0.5 ? w1 / 2 / start.wr : w1 / 2 / (1 - start.wr)
          inh1 = inw1 * start.inh / start.inw
          inleft1 = w1 / 2 - inw1 * start.wr
          intop1 = h1 / 2 - inh1 * start.hr
        }
      } else {
        inw1 = start.wr < 0.5 ? w1 / 2 / start.wr : w1 / 2 / (1 - start.wr)
        inh1 = inw1 * start.inh / start.inw
        inleft1 = w1 / 2 - inw1 * start.wr
        intop1 = h1 / 2 - inh1 * start.hr
        if (intop1 > 0 || intop1 + inh1 < h1) {
          inh1 = start.hr < 0.5 ? h1 / 2 / start.hr : h1 / 2 / (1 - start.hr)
          inw1 = inh1 * start.inw / start.inh
          inleft1 = w1 / 2 - inw1 * start.wr
          intop1 = h1 / 2 - inh1 * start.hr
        }
      }

      return {
        iw: inw1,
        ih: inh1,
        il: inleft1,
        it: intop1
      }
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
