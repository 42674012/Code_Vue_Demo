<template lang="jade">
modal.publish(:show.sync='show', effect='fade', :width='913')
  div(slot='modal-header')
    .modal-header
      .header
        i.iconfont.icon-close(@click='cancel')
        .col-sm-2.thumb
          img(:src='thumb | ossCrop "120"')
          .edit(@click="editThumb") 编辑
        .col-sm-10.prop
          p.name(style='margin-bottom: 10px')
            span(style='margin-right: 14px; color: #545454') 站点名称:
            span(v-if='!isEditingName', style='color: #a9a9a9') {{projectName}}
            input(id='project-name', v-else, type='text', v-model='projectName', lazy, @blur='isEditingName = false')
            i(v-show='!isEditingName', @click='editName($event)', ).iconfont.icon-xiugai
          p.desc
            span(style='margin-right: 14px; color: #545454') 站点简介:
            span(v-if='!isEditingDesc', style='margin-right: 20px; color: #a9a9a9') {{projectDesc}}
            input(id='project-desc', v-else, type='text', v-model='projectDesc', lazy, @blur='isEditingDesc = false')
            i(v-show='!isEditingDesc', @click='editDesc').iconfont.icon-xiugai
            span(style='margin-left: 20px; font-size: 1.2rem') (注：简介最多140个汉字)
          p.rest
            span 行业:&nbsp
            select(v-model='projectIndustryId')
              option(v-for='industry in industries', :value='industry.industryid') {{industry.industry}}
            span 场景:&nbsp
            select(v-model='projectSceneId')
              option(v-for='scene in scenes', :value='scene.sceneid') {{scene.scene}}
            span(style='margin-left: 30px; margin-right: 10px') 相关标签
            input(type='text', v-model='projectTag', lazy)

  div(slot='modal-body')
    .modal-body
      .tip
        .i.iconfont.icon-tip-up
        span(style='color: #545454') 确定是否发布微站？
        span(style='display: block; margin-left: 33px; font-size: 15px; color: #696969') 当前已经完成编辑的微站将会替换线上的微站，请谨慎操作！
      .footer
        button.btn.btn-default.cancel(@click='cancel') 取 消
        button.btn.btn-default.ok(@click='publish') 确 定 

  div(slot='modal-footer')
    // .modal-footer

cropbox(:state='state', :actions='actions', :show.sync='showCropbox')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.publish
  color #545454
  p
    margin 0
  .modal-header
    position relative
    height 193px
    i.iconfont.icon-close
      font-size 3rem
      position absolute
      top 20px
      right 20px
      cursor pointer
      z-index 1
    i.iconfont.icon-xiugai 
      font-size 15px
      border-radius 5px

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
        font-size 15px
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
    height 226px
    .tip
      position absolute
      top 51px
      left 40px
      font-size 20px
      .icon-tip-up
        display inline-block
        color #f0ad4e
        font-size 22px
        margin-right 10px
    .footer
      position absolute
      right 50px
      bottom 30px
      button
        width 119px
        height 33px
        color #545454
        font-size 14px

        &.ok
          margin-left 20px
          color #fff
          background-color #555



</style>

<script>
import Modal from '../widgets/Modal.vue'
import Dropdown from '../widgets/Dropdown.vue'
import Cropbox from '../widgets/Cropbox.vue'
import config from '../../config'
import denormalize from '../../helpers/denormalize'
import { save } from '../../helpers/project'
import { publish } from '../../helpers/site'
import fetch from 'isomorphic-fetch'

import { getProjectId, getToken } from '../../helpers/common'
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
  name: 'publish',
  props: ['state', 'actions', 'show'],
  data() {
    return {
      // qrcode: this.state.getIn(['project', '0', 'qrcodeUrl']),
      // qrcode: this.state.getIn(['site', 'project', 'qrcodeUrl']),
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
      return this.state.getIn(['site', 'project', 'coverurl'])
    },
    projectName: {
      get() {
        return this.state.getIn(['site', 'project', 'projectname'])
      },
      set(value) {
        this.actions.setSite({
          project: {
            projectname: value
          }
        })
      }
    },
    projectDesc: {
      get() {
        return this.state.getIn(['site', 'project', 'description'])
      },
      set(value) {
        this.actions.setSite({
          project: {
            description: value
          }
        })
      }
    },
    projectIndustryId: {
      get() {
        return this.state.getIn(['site', 'project', 'industryid'])
      },
      set(value) {
        this.actions.setSite({
          project: {
            industryid: value
          }
        })
      }
    },
    projectSceneId: {
      get() {
        return this.state.getIn(['site', 'project', 'sceneid'])
      },
      set(value) {
        this.actions.setSite({
          project: {
            sceneid: value
          }
        })
      }
    },
    projectTag: {
      get() {
        let tags =  this.state.getIn(['site', 'project', 'tags'])
        // return tags ? tags.join(',') : ''
        return tags ? tags : ''
      },
      set(value) {
        this.actions.setSite({
          project: {
            tags: value 
          }
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
    publish() {
      publish(this.state).then(() => {
        this.show = false
      })
    },
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


    fetch(`${config.apiHost}/BuilderIndustry/getAllIndustry/${getToken()}`)
    .then(res => res.json())
    .then(res => {
      if (res.status && res.code === 200) {
        this.industries = res.data
      }
    })


    fetch(`${config.apiHost}/BuilderScene/getAllScene/${getToken()}`)
    .then(res => res.json())
    .then(res => {
      if (res.status && res.code === 200) {
        this.scenes = res.data
      }
    })
  }

}

</script>
