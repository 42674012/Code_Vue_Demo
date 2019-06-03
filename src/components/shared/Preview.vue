<template lang="jade">
modal.preview(:show.sync='show', effect='fade', :width='722')
  div(slot='modal-header')
  div(slot='modal-body')
    .modal-body
      i.iconfont.icon-cuowu(@click='cancel')
      .player
        img.mobile(src='../../assets/images/mobile.png')
        iframe(:src='playerUrl', frameborder='0', width='219', height='391', v-el:iframe)
        //
          .icon-block
            i.iconfont.icon-arrow-up3.up(@click.stop='togglePage("previous")')
            i.iconfont.icon-arrow-down3.down(@click.stop='togglePage("next")')
      .ad
        .qrcode
          img(:src='qrcode | ossCrop "180"')
        .link
          p(style='font-size: 13px; margin-bottom: 5px') 扫描二维码 
          p(style='font-size: 13px; margin-bottom: 5px') 手机查看效果更佳 
          // p(style='font-size: 13px; color: #aeaeae; margin-bottom: 5px; -webkit-user-select: initial') {{playerUrl}}
          button.btn.btn-default.copy-btn(:data-clipboard-text='playerUrl', @click='toggleTip') 复制链接

  div(slot='modal-footer')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.preview
  color #545454
  p
    margin 0
  .modal-body
    position relative
    height 658px
    i.iconfont.icon-cuowu
      font-size 3rem
      position absolute
      top 10px
      right 10px
      color #545454
      cursor pointer
      z-index 1
      &:hover
        color #333333

    .player
      position relative
      width 554px
      height 100%
      .mobile
        position relative
        left 106px
        top 38px
        width 260px
        height 550px
      iframe
        position absolute
        top 120px
        left 128px
      .icon-block
        position absolute
        width 4rem
        height 140px
        right 70px
        top 50%
        margin-top -70px
        .up, .down
          position absolute
          font-size 4rem
        .up
          top 0
        .down
          bottom 0
    .ad
      position absolute
      top 0px
      left 380px
      right 0px
      height 100%
      .qrcode
        position absolute
        left 70px
        top 209px
        width 135px
        height 135px
        img
          width 100%
      .link
        position absolute
        top 344px
        left 70px
        width 135px
        padding-top 26px
        color #333333
        text-align center
        button
          margin-top 16px
          width 81px
          color #fff
          background-color #545454
          &:hover
            background-color #333333


.fade-transition
  transition all 0.8s ease
.fade-enter
.fade-leave
  opacity 0


</style>

<script>
import Modal from '../widgets/Modal.vue'
import config from '../../config'
import { getProjectId } from '../../helpers/common'
import ZeroClipboard from 'zeroclipboard'

export default {
  name: 'piclib',
  props: ['state', 'actions', 'show'],
  data() {
    return {
      qrcode: this.state.getIn(['project', '0', 'qrcodeUrl']),
      playerUrl: '',
      tipEl: undefined,
    }
  },
  computed: {
    pageid() {
      return this.state.getIn(['project', '0', 'webpageid'])
    },
    qrcode() {
      return this.state.getIn(['project', '0', 'qrcodeUrl'])
    }
  },
  methods: {
    cancel() {
      this.show = false
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
    modal: Modal
  },
  ready() {
    ZeroClipboard.config({swfPath: '//cdn.bootcss.com/zeroclipboard/2.2.0/ZeroClipboard.swf'})
    let zclip = new ZeroClipboard($('.copy-btn'))

    let unwatch = this.$watch('show', (nv => {
      if (nv) {
        this.playerUrl = `${config.renderHost}/player.html?id=${this.pageid}`
      } else {
        this.playerUrl = ''
      }
    }))
  }
}

</script>
