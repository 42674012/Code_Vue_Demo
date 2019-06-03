<template lang="jade">
.image-crop-slides(v-if='imgsrc')
  img.crop(v-if='!isCropping', :src='getCropImg')
  img.origin(v-if='isCropping', :src='imgsrc', v-el:imgcrop)
  .btn-wrap
    .crop-change(v-if='!isCropping')
      div.pull-right
        i.iconfont.icon-caiqie(@click='toggleCrop') 
        i.iconfont.icon-tihuan(@click='changeslide()')
    button.btn.btn-default(v-if='isCropping', @click='toggleCropOff') 确定

</template>

<style lang="stylus" scoped>
.image-crop-slides
  position relative
  img.crop
    max-height 260px
    max-width 260px
    -webkit-user-drag none
  .btn-wrap
    position absolute
    top 260px
    button
      border-radius 0
      width 260px
    .crop-change
      height 30px
      line-height 30px
      width 260px
      color #fff
      background-color #575e67
      i
        font-size 2rem
        cursor pointer
        margin-right 5px


</style>

<script>
import '../../vendors/jquery.Jcrop.js'
import '../../vendors/jquery.Jcrop.css'
import {getCropImage} from '../../helpers/common'

export default {
  name: 'image-crop-slides',
  props: ['element', 'startcb', 'cropcb', 'ratio', 'changeslide'],
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      cropstart: true,
      isCropping: false
    }
  },
  computed: {
    activeSlide() {
      return this.element.getIn(['slides', this.element.get('active') + ''])
    },
    imgsrc() {
      return this.activeSlide ? this.activeSlide.get('url') : ''
    },
    getCropImg() {
      return getCropImage(this.imgsrc, {
        crop: this.activeSlide.get('crop').toJS(),
        ratio: {w: 260}
      })
    }
  },
  methods: {
    toggleCropOff() {
      this.jcropapi.destroy()
      this.isCropping = false
    },
    toggleCrop() {
      let vm = this
      this.isCropping = true
      this.$nextTick(() => {

        $(vm.$els.imgcrop).Jcrop({
          boxWidth: 260,
          boxHeight: 260,
          aspectRatio: this.ratio.x / this.ratio.y,
          onChange: vm.onChange,
          onSelect: vm.onSelect
        }, function () {
          vm.jcropapi = this
          vm.imageWidth = vm.jcropapi.getBounds()[0]
          vm.imageHeight = vm.jcropapi.getBounds()[1]

          vm.jcropapi.setSelect([
            vm.activeSlide.getIn(['crop', 'l']),
            vm.activeSlide.getIn(['crop', 't']),
            vm.activeSlide.getIn(['crop', 'l']) + vm.activeSlide.getIn(['crop', 'w']),
            vm.activeSlide.getIn(['crop', 't']) + vm.activeSlide.getIn(['crop', 'h'])
          ])
        })
      })
    },
    onChange(c) {

      let cropdata = {
        l: parseInt(c.x < 0 ? 0 : c.x),
        t: parseInt(c.y < 0 ? 0 : c.y),
        w: parseInt(c.w),
        h: parseInt(c.h)
      }
      let inw = this.ratio.x * this.imageWidth / c.w
      let inh = this.ratio.y * this.imageHeight / c.h
      let inl = -inw * c.x / this.imageWidth
      let int = -inh * c.y / this.imageHeight
      if (this.cropstart) {
        this.startcb({
          crop: cropdata,
          iw: parseInt(inw),
          ih: parseInt(inh),
          il: parseInt(inl),
          it: parseInt(int)
        })
        this.cropstart = false
      }
      this.cropcb({
        crop: cropdata,
        iw: parseInt(inw),
        ih: parseInt(inh),
        il: parseInt(inl),
        it: parseInt(int)
      })
    },

    onSelect(c) {
      this.cropstart = true
    }
  },
  watch: {
    imgsrc() {
      this.jcropapi && this.jcropapi.destroy()
      this.isCropping = false
    }
  }
}
</script>
