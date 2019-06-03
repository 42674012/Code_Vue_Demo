<template lang="jade">
modal.publish(:show.sync='show', effect='fade', :width='1065')
  div(slot='modal-header')
    cropbox(:state='state', :actions='actions', :show.sync='showCropbox')
    .modal-header
      .header
        i.iconfont.icon-close(@click='cancel')
        .col-sm-2.thumb
          img(:src='thumb | ossCrop "120"')
          .edit(@click="editThumb") 编辑
        .col-sm-10.prop
          p.name(style='margin-bottom: 10px')
            span(v-if='!isEditingName', style='margin-right: 20px') {{projectName}}
            input(id='project-name', v-else, type='text', v-model='projectName', lazy, @blur='isEditingName = false')
            i(v-show='!isEditingName', @click='editName($event)', ).iconfont.icon-edit
          p.desc
            span 描述：
            span(v-if='!isEditingDesc', style='margin-right: 20px; color: #9a9a9a') {{projectDesc}}
            input(id='project-desc', v-else, type='text', v-model='projectDesc', lazy, @blur='isEditingDesc = false')
            i(v-show='!isEditingDesc', @click='editDesc').iconfont.icon-edit
            span(style='margin-left: 20px; font-size: 1.2rem') (注：简介最多140个汉字)
          p.rest
            span 行业:&nbsp
            select(v-model='projectIndustryId')
              option(v-for='industry in industries', :value='industry.id') {{industry.industry}}
            span 场景:&nbsp
            select(v-model='projectSceneId')
              option(v-for='scene in scenes', :value='scene.id') {{scene.scene}}
            span(style='margin-left: 30px; margin-right: 10px') 相关标签
            input(type='text', v-model='projectTag', lazy)

  div(slot='modal-body')
    .modal-body
      .col-sm-4.preview
        iframe(:src='playerUrl', frameborder='0', width='276', height='434', v-el:iframe)
        .icon-block
          i.iconfont.icon-arrow-up3.up(@click.stop='togglePage("previous")')
          i.iconfont.icon-arrow-down3.down(@click.stop='togglePage("next")')
      .col-sm-8.ad
        div(style='margin: 50px 0 0 40px; height: 400px; position: relative')
          .col-sm-4(style='padding: 0')
            .qrcode
              img(:src='qrcode | ossCrop "180"')
            span(style='font-size: 1.4rem;') 扫描二维码，手机看效果更佳
          .col-sm-8(style='height: 180px')
            .helper
            .link
              p(style='font-size: 1.8rem; margin-bottom: 5px') 推广链接
              p(style='font-size: 1.4rem; color: #aeaeae; margin-bottom: 5px; -webkit-user-select: text;') {{playerUrl}}
              button.btn.btn-default.copy-btn(:data-clipboard-text='playerUrl', @click='toggleTip') 复制
          button.btn.btn-default.pub(@click='publish') 发布


  div(slot='modal-footer')
    // .modal-footer

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.publish
  color #545454
  p
    margin 0
  .modal-header
    position relative
    height 186px
    i.iconfont.icon-close
      font-size 3rem
      position absolute
      top 20px
      right 20px
      cursor pointer
      z-index 1

    .header
      margin-top 20px
      height 117px
    .thumb
      position relative
      height 100%
      text-align center
      img
        height 118px
        width 118px
        border 1px solid #747373
      .edit
        display none
        position absolute
        width 117px
        height 25px
        line-height 25px
        left 50%
        color #fff
        margin-left -58px
        bottom 0
        background-color #000
        opacity 0.8
        cursor pointer
      &:hover
        .edit
          display block

    .prop
      position relative
      padding-left 40px
      height 100%
      .name
      .desc
        font-size 1.6rem
      .rest
        position absolute
        bottom 0
        select
          margin-right 10px
      i
        color #555555
        cursor pointer
      #project-desc
        width 300px

  .modal-body
    height 500px
    .preview
      position relative
      height 100%
      iframe
        margin 10px 0 0 20px
      .icon-block
        position absolute
        width 4rem
        height 140px
        right -20px
        top 50%
        margin-top -70px
      .up, .down
        position absolute
        /*width 4rem*/
        /*height 4rem*/
        /*line-height 4rem*/
        /*cursor pointer*/
        font-size 4rem
      .up
        top 0
      .down
        bottom 0


    .ad
      height 100%
      .qrcode
        width 180px
        height 180px
        padding 0
        img
          width 100%
      .helper
        display inline-block
        height 100%
        vertical-align middle
      .link
        display inline-block
        vertical-align middle
        button
          width 81px
          color #fff
          background-color #545454

      .pub
        position absolute
        font-size 1.8rem
        width 197px
        height 46px
        bottom 0px
        right 50px
        color #fff
        background-color #179ffe



</style>

<script>
import Modal from '../widgets/Modal.vue'
import Dropdown from '../widgets/Dropdown.vue'
import Cropbox from '../widgets/Cropbox.vue'
import config from '../../config'
import denormalize from '../../helpers/denormalize'
import {save, publish} from '../../helpers/project'
import fetch from 'isomorphic-fetch'

import { getProjectId } from '../../helpers/common'
import ZeroClipboard from 'zeroclipboard'



function checkstatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    let error = new Error(res.statusText)
    error.response = res
    throw error
  }
}

export default {
  name: 'piclib',
  props: ['state', 'actions', 'show'],
  data() {
    return {
      qrcode: this.state.getIn(['project', '0', 'qrcodeUrl']),
      isEditingName: false,
      isEditingDesc: false,
      industries: [],
      scenes: [],
      playerUrl: '',
      showCropbox: false,
      tipEl: undefined 
    }
  },
  computed: {
    thumb() {
      return this.state.getIn(['project', '0', 'coverUrl'])
    },
    projectName: {
      get() {
        return this.state.getIn(['project', '0', 'name'])
      },
      set(value) {
        this.actions.setProject({
          name: value
        })
      }
    },
    projectDesc: {
      get() {
        return this.state.getIn(['project', '0', 'description'])
      },
      set(value) {
        this.actions.setProject({
          description: value
        })
      }
    },
    projectIndustryId: {
      get() {
        return this.state.getIn(['project', '0', 'industryId'])
      },
      set(value) {
        this.actions.setProject({
          industryId: value
        })
      }
    },
    projectSceneId: {
      get() {
        return this.state.getIn(['project', '0', 'sceneId'])
      },
      set(value) {
        this.actions.setProject({
          sceneId: value
        })
      }
    },
    projectTag: {
      get() {
        return this.state.getIn(['project', '0', 'tag']).join(',')
      },
      set(value) {
        this.actions.setProject({
          tag: value.split(',')
        })
      }
    }
  },
  methods: {
    cancel() {
      this.show = false
    },
    editThumb() {
      this.showCropbox = true
    },
    editName() {
      this.isEditingName = true
      setTimeout(() => {
        document.getElementById('project-name').select()
      })
    },
    editDesc() {
      this.isEditingDesc = true
      setTimeout(() => {
        document.getElementById('project-desc').select()
      })
    },
    copy() {
      window.clipboardData.setData('Text', 'sdfsdfsdfsdsf')
    },
    publish() {
      publish(this.state).then(() => {
        this.show = false
      })
    },
    togglePage(mode) {
      this.$els.iframe.contentWindow.postMessage(mode, '*')
    },
    toggleTip() {
      if (this.tipEl) {
        this.tipEl.remove()
        this.tipEl = null
      }
      this.tipEl = document.createElement('div')
      this.tipEl.className = 'copy-tip'
      this.tipEl.text = '复制'
      let newContent = document.createTextNode('地址成功复制到剪贴板!');
      this.tipEl.appendChild(newContent)
      document.body.appendChild(this.tipEl)
      setTimeout(() => {
        this.tipEl.className = 'copy-tip copy-tip-fadein'
      }, 100)
      setTimeout(() => {
        this.tipEl.className = 'copy-tip copy-tip-fadeout'
      }, 1000)

    }
  },
  components: {
    modal: Modal,
    dropdown: Dropdown,
    cropbox: Cropbox
  },
  ready() {
    ZeroClipboard.config({swfPath: '//cdn.bootcss.com/zeroclipboard/2.2.0/ZeroClipboard.swf'})
    let zclip = new ZeroClipboard($('.copy-btn'))

    let unwatch = this.$watch('show', (nv => {
      if (nv) {
        this.playerUrl = `${config.host}/player.html?id=${getProjectId()}`
      } else {
        this.playerUrl = ''
      }
    }))


    fetch(`${config.apiHost}/industry/all`, {
      method: 'get'
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        this.industries = data.result
      }
    })


    fetch(`${config.apiHost}/scene/all`, {
      method: 'get'
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        this.scenes = data.result
      }
    })
  }

}

</script>
