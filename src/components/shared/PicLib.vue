<template lang="jade">
modal.piclib(:show.sync='show', effect='fade', :width='850')
  div(slot='modal-header')
    .modal-header
      span.title 项目素材库
      //
        button.btn.btn-default.pull-right(@click='toggleCategoryGroup("my")', :class='{active: categoryGroup==="my"}') 我的图库
      //
        button.btn.btn-default.pull-right(@click='toggleCategoryGroup("sys")', :class='{active: categoryGroup==="sys"}') 系统图库

  div(slot='modal-body')
    .modal-body
      .nav.col-sm-2
        ul
          li(v-for='cat in activeCategories', track-by='$index', @click='selectCategory(cat)', :class='{active: activeCategory.typeid === cat.typeid}') {{cat.typename}}
            .delete.pull-right(v-if='categoryGroup === "project"', @click='tryDeleteCategory(cat, $index)')
              i.iconfont.icon-false-circle
              
        .add-category(v-if='categoryGroup === "project"', @click='toggleInput')
          i.iconfont.icon-icontianjia01
        .input(v-show='isInputShown', type='text')
          input(type='text', v-model='inputCategory', v-el:input)
          i.iconfont.icon-tianjia1(@click='addCategory')
          i.iconfont.icon-cuowu(@click='toggleInput')



      .wrap.col-sm-10
        .pic.uploadBtn(v-if='categoryGroup === "project"', v-on:change='uploadPic', @click='upload')
          input(id='uploadBtn', type="file", v-el:input-file, focus, accept="image/gif,image/jpeg,image/png")
          .add(v-if='!isUploading')
            .iconfont.icon-shangchuan
            .add-title(v-show='!isUploading') 上传图片
          .add(v-else)
            .iconfont.icon-time
            .add-title {{'上传中...' + uploadingProgress + '%'}}
        .pic(v-for='pic in pics', track-by='$index', @click='selectPic(pic)', tabindex='0')
          .helper
          img(:src='pic.imgurl | ossCrop  100 ')
          .delete(v-if='categoryGroup === "project"')
          i.iconfont.icon-cuowu(v-if='categoryGroup === "project"', @click='deletePic(pic, $index)')
  div(slot='modal-footer')
    .modal-footer
      button.btn.btn-default(@click='close()') 取消
      button.btn.btn-default.confirm(@click='confirmAction()') 确定 

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.piclib
  color #545454
  .modal-header
    .title
      font-size 2rem
    .btn
      width 100px
      margin-left 20px
      border-radius 10px
      border none
      background-color #ccc
      &.active
        color #fff
        background-color #545454

  .modal-body
    height 400px
    .nav
      position relative
      height 100%
      background-color #eaeded
      padding-right 0px
      border-right 10px solid #fff
      ul
        list-style none
        margin 0
        padding-left 0
        li
          height 30px
          line-height 30px
          padding-left 15px
          cursor pointer
          &.active
            background-color #ccc
          .delete
            display none
            margin-right 10px
          &:hover
            background-color #ccc
            .delete
              display block
      .add-category
        position absolute
        width 100%
        height 30px
        line-height 30px
        background-color #179eff
        cursor pointer
        color #fff
        text-align center
        bottom 0px
      .input
        position absolute
        width 100%
        bottom 30px
        input
          width 100%
          padding-right 30px
        .iconfont
          position absolute
          cursor pointer
        .icon-cuowu
          right 0px
        .icon-tianjia1
          right 15px


    .wrap
      display flex
      align-content flex-start
      flex-wrap wrap
      height 100%
      background-color #eaeded
      overflow-y scroll
      .pic
        flex 1
        position relative
        min-width 100px
        max-width 100px
        height 100px
        margin 10px 10px
        border 1px solid #545454
        text-align center
        overflow hidden
        outline none
        &:focus
          border 2px solid #179eff
          background-color #179eff
        .helper
          display inline-block
          height 100%
          vertical-align middle
        img
          display inline-block
          vertical-align middle
          max-width 100%
          max-height 100%
        .delete
          display none
          position absolute
          top 0px
          width 100%
          height 20px
          background-color #000
          opacity 0.5
        .icon-cuowu
          display none
          position absolute
          top 0px
          right 5px
          color #fff
          font-size 1.4rem
          cursor pointer
        &:hover
          .delete
            display block
          .icon-cuowu
            display inline

        &.uploadBtn
          position relative
          background-color #fff
          cursor pointer
          .add
            margin-top 20px
            color #65a6ff
            .iconfont
              font-size 3rem
            .add-title
              font-size 1.4rem
          input
            display none

  .modal-footer
    button
      width 119px
      height 33px
      &.confirm
        background-color #545451
        color #fff

</style>

<script>

import Modal from '../widgets/Modal.vue'
import Dropdown from '../widgets/Dropdown.vue'
import config from '../../config'
import {PIC_MODEL, SLIDES_MODEL} from '../../models/data'
import fetch from 'isomorphic-fetch'
import toastr from 'toastr'
import EventListener from '../../helpers/events'
import { getToken, getProjectId } from '../../helpers/common'

export default {
  name: 'piclib',
  props: ['state', 'actions', 'scenario', 'show'],
  data() {
    return {
      isLoaded: false,
      categoryGroup: undefined,
      activeCategory: undefined,
      activeCategories: undefined,
      sysPicCategories: [],
      myPicCategories: [],
      projectPicCategories: [],
      selectedPic: undefined,
      isInputShown: false,
      inputCategory: '',
      uploadingProgress: 0,
      isUploading: false,
      pics: []
      
    }
  },
  computed: {
      // pics() {
        // return this.activeCategory && this.activeCategory.resourceURL
        // let cat = this.activeCategory
        // let token = getToken()
        // fetch(`${config.apiHost}/builderImg/getImgByType/${token}/${cat.typeid}`)
        //   .then(res => res.json())
        //   .then(data => {
        //     this.pics = data.data
        //     // mock data for test
        //     if (this.pics.length === 0) {
        //       this.pics.push({
        //         "imgid": "1",
        //         "typeid": "1",
        //         "imgurl": "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D200/sign=af9259bf03082838770ddb148898a964/6159252dd42a2834bc76c4ab5fb5c9ea14cebfba.jpg",
        //         "createtime": 1472094002000,
        //         "deleteflag": false
        //       })

        //     }
        //     this.isLoaded = true
        //   }
      // },
  },
  methods: {
    close() {
      this.show = false
    },
    selectPic(pic) {
      this.selectedPic = pic
    },
    selectCategory(category) {
      this.activeCategory = category
      fetch(`${config.apiHost}/builderImg/getImgByType/${getToken()}/${category.typeid}`)
        .then(res => res.json())
        .then(data => {
          this.pics = data.data
        })
    },
    toggleInput() {
      this.isInputShown = !this.isInputShown
      this.inputCategory = ''
    },
    addCategory() {
      if (!this.inputCategory) return
      if (this.inputCategory.length > 6) {
        toastr.warning('', '不能超过6个汉字', {
          positionClass: 'toast-top-center',
          timeOut: 800
        })
        return
      }

      let data = {
        typename: this.inputCategory,
        builderprojectid: getProjectId()
      }
      fetch(`${config.apiHost}/builderImgType/saveBuilderImgType/${getToken()}`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status && data. code === 200) {
            toastr.success('添加分组成功', '', {
              positionClass: 'toast-top-center',
              timeOut: 800
            })
            this.afterAddCategory(data.data)
          } else {
            toastr.error(data.result, '', {
              positionClass: 'toast-top-center',
              timeOut: 1000
            })
          }
          this.toggleInput()
        })
    },
    afterAddCategory(data) {
      console.debug('category is added, need to know typename and typeid')
      console.log(data)
      this.projectPicCategories.push(data)
    },
    tryDeleteCategory(cat, index) {
      swal({
        title: '请确认是否删除此图库分组',
        text: '注：改图库分组下所有图片会被同时删除',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        confirmButtonColor: '#179eff',
        cancelButtonText: '取消'
      }, () => {
        this.deleteCategory(cat, index)
      })
    },
    deleteCategory(cat, index) {
      fetch(`${config.apiHost}/builderImgType/deleteBuilderImgTypeByPk/${getToken()}/${cat.typeid}`, {
        method: 'post',
      })
        .then(res => res.json())
        .then(data => {
          if (data.status && data.code === 200) {
            toastr.success(data.data, '', {
              positionClass: 'toast-top-center',
              timeOut: 800
            })
            this.afterDeleteCategory(index)
          } else {
            toastr.error(data.result, '', {
              positionClass: 'toast-top-center',
              timeOut: 1000
            })
          }
        })
    },
    afterDeleteCategory(index) {
      this.projectPicCategories.splice(index, 1)
      this.selectCategory(this.projectPicCategories[0])
    },
    toggleCategoryGroup(group) {
      this.categoryGroup = group
      if (group === 'sys') {
        this.activeCategories = this.sysPicCategories
      } else if (group === 'my') {
        this.activeCategories = this.myPicCategories
      }
      this.activeCategory = this.activeCategories[0]
    },
    confirmAction() {
      console.debug(this.scenario)
      switch (this.scenario) {
        case 'CHANGE_BG':
          this.changeBg()
          break
        case 'CHANGE_HEADER_LOGO':
          this.changeHeader()
          break
        case 'CHANGE_PIC':
          this.changePic()
          break
        case 'ADD_PIC':
          this.addPic()
          break
        case 'ADD_SLIDES':
          this.addSlides()
          break
        case 'ADD_SLIDE':
          this.addSlide()
          break
        case 'CHANGE_SLIDE':
          this.changeSlide()
          break
        default:
          break
      }
    },
    changeBg() {
      let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
      if (this.selectedPic) {
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          this.actions.setPage(pageid, {
            t: el.t,
            l: el.l,
            w: el.w,
            h: el.h,
            crop: el.crop,
            bgpic: this.selectedPic.imgurl
          })
        })
        this.close()
      }
    },
    changeHeader() {
      let elementid = this.state.getIn(['editorStatus', 'selectedElementId'])
      if (this.selectedPic) {
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          this.actions.setElementUndoable(elementid, {
            logo: {
              url: this.selectedPic.imgurl,
              crop: el.crop
            }
          })
        })
        this.close()
      }
    },
    changePic() {
      let elementid = this.state.getIn(['editorStatus', 'selectedElementId'])
      if (this.selectedPic) {
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          this.actions.setElement(elementid, {
            it: 0,
            il: 0,
            iw: el.iw,
            ih: el.ih,
            url: this.selectedPic.imgurl
          })
        })
        this.close()
      }
    },
    addPic() {
      if (this.selectedPic) {
        let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
        let slugid = this.state.getIn(['editorStatus', 'slugId'])
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          this.actions.addElement(el, pageid, slugid)
        })
        this.close()
      }
    },
    addSlides() {
      if (this.selectedPic) {
        let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
        let slugid = this.state.getIn(['editorStatus', 'slugId'])
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          this.actions.addElement(el, pageid, slugid)
        })
        this.close()
      }
    },
    addSlide() {
      let elementid = this.state.getIn(['editorStatus', 'selectedElementId'])
      let element = this.state.getIn(['elements', elementid + ''])
      let slides = element.get('slides').toJS()
      if (this.selectedPic) {
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          el.url = this.selectedPic.imgurl
          slides.push(el)

          this.actions.setElement(elementid, {
            slides: slides,
            active: slides.length -1
          })
        })
        this.close()
      }
    },
    changeSlide() {
      let elementid = this.state.getIn(['editorStatus', 'selectedElementId'])
      let element = this.state.getIn(['elements', elementid + ''])
      let slides = element.get('slides').toJS()
      let active = element.get('active')

      if (this.selectedPic) {
        this.prepareElement(this.selectedPic.imgurl).then(el => {
          el.url = this.selectedPic.imgurl
          slides.splice(active, 1, el)

          this.actions.setElement(elementid, {
            slides: slides,
          })
        })
        this.close()
      }

    },
    prepareElement(url) {
      let vm = this
      return new Promise((resolve, reject) => {
        $('<img />').one('load', function () {
          let l, t, w, h, iw, ih, el
          if (vm.scenario === 'CHANGE_BG') { // 更换背景
            let crop = {l: 0, t: 0}
            let r = this.width / this.height
            let ratio = 640 / 1008
            if (r > ratio) { // 更具背景图片的长宽比来设置裁图数据
              crop.h = this.height
              crop.w = parseInt(this.height * ratio)
            } else {
              crop.w = this.width
              crop.h = parseInt(this.width / ratio)
            }
            el =  {
              l: 0,
              t: 0,
              w: parseInt(640 * this.width / crop.w),
              h: parseInt(1008 * this.height / crop.h),
              crop: crop
            }
          } else if (vm.scenario === 'CHANGE_HEADER_LOGO') { // 更换页面标题Logo
              let crop = {l: 0, t: 0}
              let r = this.width / this.height
              let ratio = 1 
              if (r > ratio) { // 更具背景图片的长宽比来设置裁图数据
                crop.h = this.height
                crop.w = parseInt(this.height * ratio)
              } else {
                crop.w = this.width
                crop.h = parseInt(this.width / ratio)
              }
              el =  {
                crop: crop
              }
          } else if (vm.scenario === 'CHANGE_PIC') { // 更换图片元素
            let elementid = vm.state.getIn(['editorStatus', 'selectedElementId'])
            let element = vm.state.getIn(['elements', elementid + ''])
            w = element.get('w')
            h = element.get('h')
            let r1  = w / h
            let r2 = this.width / this.height
            if (r1 > r2) {
              iw = w
              ih = iw / r2
            } else {
              ih = h
              iw = ih * r2
            }
            el = {
              ih,
              iw,
              nw: this.width,
              nh: this.height
            }
          } else if(vm.scenario === 'ADD_PIC') { // 添加图片元素
            // w = 640 * config.SCALE
            w = 320
            h = w / this.width * this.height
            el = Object.assign({}, PIC_MODEL, {
              l: 0,
              t: document.getElementsByClassName('canvas-window-wrapper')[0].scrollTop,
              url: url,
              w: parseInt(w, 10),
              h: parseInt(h, 10),
              iw: parseInt(w, 10),
              ih: parseInt(h, 10),
              nw: this.width,
              nh: this.height
            })
          } else if (vm.scenario === 'ADD_SLIDES') { // 添加图集元素
            w = 320 * config.SCALE
            h = w / this.width * this.height
            el = Object.assign({}, SLIDES_MODEL, {
              l: 0,
              t: 0,
              w: parseInt(w, 10),
              h: parseInt(h, 10),
            })
            el.slides[0].url = url
            el.slides[0].iw = parseInt(w, 10)
            el.slides[0].ih = parseInt(h, 10)
            el.slides[0].crop.w = this.width
            el.slides[0].crop.h = this.height
            el.slides[0].nw = this.width
            el.slides[0].nh = this.height
          } else if (vm.scenario === 'ADD_SLIDE' || vm.scenario === 'CHANGE_SLIDE') { // 添加图集元素的图片
            let elementid = vm.state.getIn(['editorStatus', 'selectedElementId'])
            let element = vm.state.getIn(['elements', elementid + ''])
            w = element.get('w')
            h = element.get('h')
            let r1  = w / h
            let r2 = this.width / this.height
            if (r1 > r2) {
              iw = w
              ih = iw / r2
            } else {
              ih = h
              iw = ih * r2
            }

            el = {
              il: 0,
              it: 0,
              iw: parseInt(iw, 10),
              ih: parseInt(ih, 10),
              nw: this.width,
              nh: this.height,
              crop: {
                l: 0,
                t: 0,
                w: parseInt(w / iw * this.width),
                h: parseInt(h / ih * this.height)
              },
            }

            if (vm.scenario === 'ADD_SLIDE') {
              el.text = ''
              el.trigger = {
                on: false,
                t: 0, // 1 - 站外链接 2 - 站内链接
                v: ''
              }
            }
          }
          resolve(el)
        }).attr('src', url)
      })
    },
    upload() {
      document.getElementById('uploadBtn').click()
    },
    uploadPic() {
      let vm = this
      vm.isUploading = true

      var data = new FormData()
      data.append('uploadImg', this.$els.inputFile.files[0])
      // data.append('typeID', this.activeCategory.typeID)
      let typeid = this.activeCategory.typeid

      $.ajax({
        type: 'POST',
        url: `${config.apiHost}/file/uploadImg/${getToken()}/${typeid}`,
        contentType: false,
        dataType: 'json',
        data: data,
        // xhrFields: {
        //   withCredentials: true
        // },
        processData: false,
        xhr() {
          let xhr = $.ajaxSettings.xhr()
          if (xhr.upload) {
            xhr.upload.addEventListener('progress', e => {
              let done = e.position || e.loaded
              let total = e.totalSize || e.total
              vm.uploadingProgress = Math.round(done / total * 100)
            }, false)
          }
          return xhr
        }
      }).
      done(data => {
        if (data.status) {
          toastr.success('上传图片成功', '', {
            positionClass: 'toast-top-center',
            timeOut: 800
          })
          this.afterUploadPic(data.data)
        } else {
          toastr.error(data.result, '', {
            positionClass: 'toast-top-center',
            timeOut: 1000
          })
        }
      }).
      fail(data => {
        console.error(data)
      }).
      always(() => {
        vm.isUploading = false
      })


      // fetch(`${config.apiHost}/resource/image/user/uploadImage`, {
      //   method: 'post',
      //   credentials: 'include',
      //   body: data
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     console.debug(data)
      //     if (data.status) {
      //       toastr.success('上传图片成功', '', {
      //         positionClass: 'toast-top-center',
      //         timeOut: 800
      //       })
      //       this.afterUploadPic(data.result)
      //     } else {
      //       toastr.error(data.result, '', {
      //         positionClass: 'toast-top-center',
      //         timeOut: 1000
      //       })
      //     }
      //   })
    },
    afterUploadPic(data) {
      this.pics.unshift(data)
      // this.activeCategory.resourceURL.push({
      //   imgID: data.imgID,
      //   imgurl: data.imgurl
      // })
    },
    deletePic(pic, index) {
      var data = new FormData()
      // data.append('imgID', pic.imgID)
      fetch(`${config.apiHost}/builderImg/deleteBuilderImgByPk/${getToken()}/${pic.imgid}`, {
        method: 'post',
        // credentials: 'include',
        body: data
      })
        .then(res => res.json())
        .then(data => {
          if (data.status && data.code === 200) {
            toastr.success('删除图片成功', '', {
              positionClass: 'toast-top-center',
              timeOut: 800
            })
            this.afterDeletePic(index)
          } else {
            toastr.error(data.result, '', {
              positionClass: 'toast-top-center',
              timeOut: 1000
            })
          }
        })
    },
    afterDeletePic(index) {
      this.pics.splice(index, 1)
    }
  },
  components: {
    modal: Modal,
    dropdown: Dropdown
  },
  ready() {
    let unwatch = this.$watch('show', val => {
      if (val && !this.isLoaded) {

        // fetch(`${config.apiHost}/resource/image/system/getImages`, {
        //   credentials: 'include'
        // })
        //   .then(res => res.json())
        //   .then(data => {
        //     this.sysPicCategories = data.result
        //     // this.activeCategories = this.sysPicCategories
        //     // this.activeCategory = this.sysPicCategories[0]
        //     // this.categoryGroup = 'sys'
        //     this.isLoaded = true
        //   })

        // fetch(`${config.apiHost}/resource/image/user/getImages`, {
        let token = getToken()
        let pid = getProjectId()
        fetch(`${config.apiHost}/builderImgType/getImgTypeByProjectId/${token}/${pid}`, {
          // credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            this.projectPicCategories = data.data
            this.activeCategories = this.projectPicCategories
            this.activeCategory = this.projectPicCategories[0]
            // this.categoryGroup = 'my'
            this.categoryGroup = 'project'
            // this.isLoaded = true
            return this.activeCategory
          })
          .then(cat => {
            fetch(`${config.apiHost}/builderImg/getImgByType/${token}/${cat.typeid}`)
              .then(res => res.json())
              .then(data => {
                this.pics = data.data
                // mock data for test
                this.isLoaded = true
              })
          })

        unwatch()
      }
    })

    EventListener.listen(this.$els.input, 'keydown', e => e.stopPropagation())
    EventListener.listen(this.$els.input, 'keyup', e => e.stopPropagation())
  }

}

</script>
