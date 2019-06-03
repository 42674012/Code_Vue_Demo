<template lang="jade">
modal.preview(:show.sync='show', effect='fade', :width='1014')
  div(slot='modal-header')
  div(slot='modal-body')
    .modal-body
      i.iconfont.icon-close(@click='cancel')
      .player
        iframe(:src='playerUrl', frameborder='0', width='276', height='434', v-el:iframe)
        .icon-block
          i.iconfont.icon-arrow-up3.up(@click.stop='togglePage("previous")')
          i.iconfont.icon-arrow-down3.down(@click.stop='togglePage("next")')
      .ad
        .qrcode
          img(:src='qrcode | ossCrop "180"')
        .link
          p(style='font-size: 1.8rem; margin-bottom: 5px') 推广链接
          p(style='font-size: 1.4rem; color: #aeaeae; margin-bottom: 5px; -webkit-user-select: initial') {{playerUrl}}
          button.btn.btn-default.copy-btn(:data-clipboard-text='playerUrl', @click='toggleTip') 复制

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
    height 617px
    i.iconfont.icon-close
      font-size 3rem
      position absolute
      top 20px
      right 20px
      cursor pointer
      z-index 1
    .player
      position relative
      width 554px
      height 100%
      iframe
        position absolute
        top 90px
        left 122px
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
      left 554px
      right 0px
      height 100%
      .qrcode
        position absolute
        left 96px
        top 176px
        width 180px
        height 180px
        img
          width 100%
      .link
        position absolute
        top 394px
        left 96px
        button
          width 81px
          color #fff
          background-color #545454

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
      tipEl: undefined
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
        this.playerUrl = `${config.host}/player.html?id=${getProjectId()}`
      } else {
        this.playerUrl = ''
      }
    }))
  }
}

</script>
