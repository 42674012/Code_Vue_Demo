<template lang="jade">
.image-crop(v-if='imgsrc')
  img.crop(v-if='!isCropping', :src='getCropImg')
  img.origin(v-if='isCropping', :src='imgsrc', v-el:imgcrop)
  .btn-wrap
    button.btn.btn-default(v-if='!isCropping', @click='toggleCrop') 裁剪
    button.btn.btn-default(v-if='isCropping', @click='toggleCropOff') 确定

</template>

<style lang="stylus" scoped>
.image-crop
  position relative
  img.crop
    height 260px
    -webkit-user-drag none
  .btn-wrap
    position absolute
    top 260px
    button
      border-radius 0
      width 260px

</style>

<script>
import '../../vendors/jquery.Jcrop.js'
import '../../vendors/jquery.Jcrop.css'
import {getCropImage} from '../../helpers/common'

export default {
  name: 'image-crop',
  props: ['element', 'startcb', 'cropcb', 'ratio'],
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      cropstart: true,
      isCropping: false
    }
  },
  computed: {
    imgsrc() {
      return this.element.getIn(['logo', 'url'])
    },
    getCropImg() {
      return getCropImage(this.imgsrc, {
        crop: this.element.getIn(['logo', 'crop']).toJS(),
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
            vm.element.getIn(['logo', 'crop', 'l']),
            vm.element.getIn(['logo', 'crop', 't']),
            vm.element.getIn(['logo', 'crop', 'l']) + vm.element.getIn(['logo', 'crop', 'w']),
            vm.element.getIn(['logo', 'crop', 't']) + vm.element.getIn(['logo', 'crop', 'h'])
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
          cropData: cropdata,
          width: parseInt(inw),
          height: parseInt(inh),
          left: parseInt(inl),
          top: parseInt(int)
        })
        this.cropstart = false
      }
      this.cropcb({
        cropData: cropdata,
        width: parseInt(inw),
        height: parseInt(inh),
        left: parseInt(inl),
        top: parseInt(int)
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
