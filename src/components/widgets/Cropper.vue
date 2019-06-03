<template lang="jade">
.cropper-wrap(v-if='element', id='cropper', :style='wrapStyle')
  .img-wrap
    img(:src='picid', :style='style', v-el:pic)
  .btn-group.toolbar(v-show='showToolbar')
    button.btn.btn-default(@click='confirm') 确定
    button.btn.btn-default(@click='zoom(0.1)') +
    button.btn.btn-default(@click='zoom(-0.1)') -
    button.btn.btn-default(@click='cancel') 取消
</template>

<style lang="stylus" scoped>
.cropper-wrap
  position absolute
  height 100%
  width 100%
  .img-wrap
    position absolute
    height 100%
    width 100%
    overflow hidden

    img
      position absolute

  .toolbar
    position absolute
    bottom -50px
    button
      color #fff
      background-color #575e67
      border 1px solid #eaeded

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import config from '../../config'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'


export default {
  name: 'cropper',
  mixins: [elementHelper],
  props: ['state', 'actions'],
  data() {
    return {
      cropper: undefined,
      showToolbar: false
    }
  },
  computed: {
    elementid() {
      return this.state.getIn(['editorStatus', 'selectedElementId'])
    },
    element() {
      if (this.elementid !== undefined && this.elementid !== -1 && this.elementid !== -2 && this.elementid !== -3) {
        let element = this.state.getIn(['elements', this.elementid + ''])
        let type = element.get('type')
        if (type === 'pic') {
          return element
        }
      }
    },
    picid() {
      return this.element && this.element.get('url')
    },
    wrapStyle() {
      let ch = this.state.getIn(['pages', '1', 'ch']) || this.state.getIn(['editorStatus', 'canvasHeight'])
      return {
        width: this.px(config.viewportX),
        height: this.px(ch),
        left: '50%',
        marginLeft: this.px(-config.viewportX / 2),
      }
    },
    toolbarStyle() {
      return {
        top: this.px(config.viewportY),
        left: '0px'
      }
    },
    style() {
      if (this.element) {
        return {
          top: this.px((this.element.get('t') + this.element.get('it'))),
          left: this.px((this.element.get('l') + this.element.get('il'))),
          width: this.px(this.element.get('iw')),
          // height: this.px(this.element.get('inh')),
        }
      }
    }
  },
  methods: {
    toggleCrop(aspectRatio) {
      let vm = this
      this.cropper = new Cropper(this.$els.pic, {
        viewMode: 1,
        movable: true, // allow to move image
        cropBoxMovable: true, // allow to move cropbox
        aspectRatio: aspectRatio,
        checkCrossOrigin: false,
        dragMode: 'move',
        built() {
          let canvasData = {
            top: (vm.element.get('t') + vm.element.get('it')),
            left: (vm.element.get('l') + vm.element.get('il')),
            width: vm.element.get('iw')
          }
          let cropboxData = {
            top: vm.element.get('t'),
            left: vm.element.get('l'),
            width: vm.element.get('w'),
            height: vm.element.get('h')
          }
          vm.cropper.setCropBoxData(cropboxData)
          vm.cropper.setCanvasData(canvasData)
        }
      })
      this.actions.setCroppingPic({
        id: this.elementid
      })
      setTimeout(() => {
        document.getElementById('cropper').style.zIndex = 1
        this.showToolbar = true
      })
    },
    cancel() {
      if (this.cropper) this.cropper.destroy()
      this.cropper = undefined
      document.getElementById('cropper').style.zIndex = 0
      this.showToolbar = false
      this.actions.setCroppingPic({
        id: undefined
      })
    },
    confirm() {
      let canvasData = this.cropper.getCanvasData()
      let cropboxData = this.cropper.getCropBoxData()
      let cropData = this.cropper.getData()

      let payload = {
        // 图片元素属性
        t: parseInt(cropboxData.top),
        l: parseInt(cropboxData.left),
        w: parseInt(cropboxData.width),
        h: parseInt(cropboxData.height),
        // 图片属性
        it: -parseInt(canvasData.height * cropData.y / canvasData.naturalHeight),
        il: -parseInt(canvasData.width * cropData.x / canvasData.naturalWidth),
        iw: parseInt(canvasData.width),
        ih: parseInt(canvasData.height),
        crop: {
          l: parseInt(cropData.x),
          t: parseInt(cropData.y),
          h: parseInt(cropData.height),
          w: parseInt(cropData.width)
        }
      }
      console.log(this.elementid, payload)


      this.actions.setElementUndoable(this.elementid, payload)
      this.cropper.destroy()
      this.cropper = undefined
      document.getElementById('cropper').style.zIndex = 0
      this.showToolbar = false
      this.actions.setCroppingPic({
        id: undefined 
      })
    },
    zoom(ratio) {
      this.cropper.zoom(ratio)
    }
  },
  components: {
  },
  ready() {
    let vm = this
    this.$on('CROP_IMAGE', pl => {
      console.log(pl)
      if (pl.elementid === -1) { // 切换页面时关闭裁剪
        this.cancel()
      } else if (!this.cropper) {
        this.toggleCrop(pl.aspectRatio)
      } else {
        this.cropper.setAspectRatio(pl.aspectRatio)
      }
    })
  }
}
</script>
