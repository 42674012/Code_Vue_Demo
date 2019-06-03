<template lang="jade">
modal.cropbox(:show.sync='show', effect='fade', :width='400')
  div(slot='modal-header')
  div(slot='modal-body')
    .cropbox-container
      .imageBox
        .thumbBox
        .spinner
      .action
        input.fileinput(type='file', accept='image/gif,image/jpeg,image/png', @change='onFileChange')
        button.btn.btn-default(href='#', @click='onFileUpload') 上传
        button.btn.btn-default.zoom(@click='zoomin')
          span +
        button.btn.btn-default.zoom(@click='zoomout')
          span -
        button.btn.btn-default.confirm-btn(@click='onConfirmCropClick', style='margin-left: 30px') 确定
        button.btn.btn-default.cancel-btn(@click='onCancelCropClick') 取消
  div(slot='modal-footer')
</template>

<style lang="stylus" scoped>
.cropbox-container
    width 400px
    height 400px


    .imageBox
      position relative 
      width 100%
      height 100%
      border 1px solid #aaa
      background #fff
      overflow hidden
      background-repeat no-repeat
      cursor move

      .thumbBox
        position absolute
        top 50%
        left 50%
        width 200px
        height 200px
        margin-top -100px
        margin-left -100px
        border 1px solid rgb(102, 102, 102)
        box-shadow 0px 0px 0px 100px rgba(0, 0, 0, 0.5)
        background none repeat scroll 0% 0% transparent

      .spinner
        display none



      /*.zoom
        position absolute
        top 50%
        left 80%
        width 30px
        height 30px
        border-radius 15px
        background-color #fff
        text-align center
        font-size 2rem
        ling-height 30px
        cursor pointer
      .zoomin
        margin-top -30px
      .zoomout
        margin-top 30px*/



    .action
      width 400px
      height 60px
      background-color #fff
      input
        float left
        display none
      /*.input-fake
        color black
        text-decoration underline
        line-height 60px
        cursor pointer
        float left
        margin-left 20px*/
      button
        /*float right*/
        background-color #575e67
        color #fff
        height 30px
        line-height 30px
        width 70px
        padding 0
        margin-top 15px
        margin-left 20px
      .confirm-btn
        margin-right 10px
      .zoom
        text-align center
        color #000
        width 30px
        background-color transparent



</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import config from '../../config'
import { getToken } from '../../helpers/common'
import Modal from './Modal.vue'
import Cropbox from '../../vendors/cropbox'
import fetch from 'isomorphic-fetch'




export default {
  name: 'cropbox',
  mixins: [elementHelper],
  props: ['state', 'actions', 'show'],
  data() {
    return {
      cropbox: undefined,
      cropOptions: {
        imageBox: '.imageBox',
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: this.state.getIn(['site', 'project', 'coverurl'])
      }
    }
  },
  computed: {

  },
  methods: {
    onFileUpload() {
      $('.cropbox-container .fileinput').click()
    },
    onFileChange(e) {
      this.file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.cropOptions.imgSrc = e.target.result
        this.cropbox = new Cropbox(this.cropOptions)
      }
      reader.readAsDataURL(this.file)
      this.files = []
    },
    zoomin() {
      this.cropbox.zoomIn()
    },
    zoomout() {
      this.cropbox.zoomOut()
    },
    onCancelCropClick() {
      this.show = false
    },
    onConfirmCropClick() {
      let file = new File([this.cropbox.getBlob()], new Date().getTime() + '.jpg')
      this.uploadPic(file)

    },
    uploadPic(file) {
      let typeid = 1
      var data = new FormData()
      data.append('uploadImg', file)
      fetch(`${config.apiHost}/file/uploadArticleImg/${getToken()}`, {
        method: 'post',
        // credentials: 'include',
        body: data
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.status) {
            console.debug(data.data)
            // toastr.success('上传图片成功', '', {
            //   positionClass: 'toast-top-center',
            //   timeOut: 800
            // })
            this.actions.setSite({
              project: { coverurl: data.data}
            })
            this.show = false
          } else {
            console.error(data.result)
            // toastr.error(data.result, '', {
            //   positionClass: 'toast-top-center',
            //   timeOut: 1000
            // })
          }
        })
    }
  },
  components: {
    modal: Modal
  },
  ready() {
    this.cropbox = new Cropbox(this.cropOptions)
  }
}
</script>
