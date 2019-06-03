<template>
  <div class="modal fade" role="dialog"
    :class="{
    'fade':effect === 'fade',
    'zoom':effect === 'zoom'
    }"
    >
    <div class="modal-dialog" role="document"
      :style="{'width': width + 'px'}">
      <div class="modal-content">
        <slot name="modal-header">
          <div class="modal-header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
            <h4 class="modal-title" >{{modalContent.title}}</h4>
          </div>
        </slot>
        <slot name="modal-body">
          <div class="modal-body">{{modalContent.message}}</div>
        </slot>
        <slot name="modal-footer">
          <div class="modal-footer">
            <button type="button" class="btn tipsModalBtn sure-delete" @click="callback">删除</button>
            <button type="button" class="btn tipsModalBtn cancel" @click="close">取消</button>
            <button type="button" class="btn tipsModalBtn sure-back" @click="callback">确定</button>
            <button type="button" class="btn tipsModalBtn save-back" @click="callback">保存</button>
            <button type="button" class="btn tipsModalBtn sure-close" @click="close">知道了</button>
            <a href="http://mp.weixin.qq.com/s?__biz=MjM5ODc3OTM5Mw==&mid=213877980&idx=1&sn=ff00e1dcf4323ecd91e4db8ed82b96be#rd" target="_blank" type="button" class="btn tipsModalBtn press-pic-btn" @click="close">压缩图片</a>
            <a href="http://mp.weixin.qq.com/s?__biz=MjM5ODc3OTM5Mw==&mid=213877980&idx=2&sn=754b95a43dd60bae956adc3a0b1dcc3f#rd" target="_blank" type="button" class="btn tipsModalBtn press-music-btn" @click="close">压缩音乐</a>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.modal {
  transition: all 0.3s ease;
}
.modal.in {
  background-color: rgba(0,0,0,0.33);
}
.modal.zoom .modal-dialog {
    -webkit-transform: scale(0.1);
    -moz-transform: scale(0.1);
    -ms-transform: scale(0.1);
    transform: scale(0.1);
    top: 300px;
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
}
.modal.zoom.in .modal-dialog {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    -webkit-transform: translate3d(0, -300px, 0);
    transform: translate3d(0, -300px, 0);
    opacity: 1;
}

.modal-content
  border-radius 0

  button
    border-radius 0

.modal-header
  height 45px
  width auto
  margin-left 20px
  margin-right 20px
  padding-left 0
  border-bottom 1.2px solid #ccc
  font-size 16px
  color #4A4A4A
  line-height 21px
  text-align left
  & .close 
    margin-right -30px
    margin-top -15px
.modal-body
  height 50px
  width 100%
  margin-left 20px
  margin-right 20px
  padding-left 0
  border-top 3px
  font-size 14px
  color #83817B
  line-height 20px
  text-align left

.modal-footer
  height 60px
  width 100%
  padding-top 5px
  padding-right 20px
  font-size 20px
  border 0px

  .btn
    margin-left 10px !important
  .sure-delete
    background #F67171
    border-radius 3px
    width 70px
    height 35px
    font-size 14px
    color #FFFFFF
    line-height 20px
    text-align center
    &:hover
      background #e67171
  .cancel
    font-size 14px
    color #83817B
    line-height 20px
    text-align center
    background #EEEEEE
    border 1px solid #E5E5E5
    border-radius 3px
    width 70px
    height 35px
    &:hover
      background #dCdCdC
  .save-back,
  .sure-back
    background #99C432
    border-radius 3px
    width 70px
    height 35px
    font-size 14px
    color #FFFFFF
    line-height 20px
    text-align center
    &:hover
      background #89b422
  .sure-close
    background #99C432
    border-radius 3px
    width 100px
    height 35px
    font-size 14px
    color #FFFFFF
    line-height 20px
    text-align center
    &:hover
      background #89b422
  .press-music-btn,
  .press-pic-btn
    background #99C432
    border-radius 3px
    width 100px
    height 35px
    font-size 14px
    color #FFFFFF
    line-height 20px
    text-align center
    text-decoration none
    display inline-block
    &:hover
      background #89b422

</style>

<script>
import EventListener from '../../helpers/events'
  export default {
  	data() {
	    return {
	      modalContent: {
	        title: '确认离开',
	        message: '确定要离开此页面吗？记得先保存数据哦！',
	        callback: () =>{}
	      }
	    }
	  },
	  events: {
	  	'hook:created' : function(){
	  		console.debug('TipsModal.vue hook created')
	  	},
	  	DELETE_PAGE: 'delete',
	  	BACK_PROLIST: 'back',
	  	IMAGE_WARN: 'imageWarn',
	  	MUSIC_WARN: 'musicWarn'
	  },
    props: {
      title: {
        type: String,
        default: ''
      },
      show: {
        require: true,
        type: Boolean,
        twoWay: true
      },
      width: {
        type: Number,
        default: 600
      },
      callback: {
        type: Function,
        default: function(){}
      },
      effect: {
        type: String,
        default: 'fade'
      }
    },
    watch: {
      show(val) {
        const el = this.$el
        const body = document.body
        if (val) {
          el.querySelector('.modal-content').focus()
          el.style.display = 'block'
          setTimeout(()=> el.classList.add('in'), 0)
          body.classList.add('modal-open')
          this._blurModalContentEvent = EventListener.listen(this.$el, 'click', (e)=> {
            if (e.target === el) this.show = false
          })
        } else {
          if (this._blurModalContentEvent) this._blurModalContentEvent.remove()
          el.classList.remove('in')
          setTimeout(()=> {
            el.style.display = 'none'
            body.classList.remove('modal-open')
            body.style.paddingRight = '0'
          }, 300)
        }
      }
    },
    methods: {
      close() {
      	let self = this
	      let modalContent = {
	        title: '',
	        message: '',
	        callback: () =>{}
	      }
        this.show = false
        setTimeout(()=> {
	      	self.$set('modalContent', modalContent)
        }, 300)
      },
	    delete(modalContent) {
	      let self = this
	      self.$set('modalContent', modalContent)
	      $('.tipsModalBtn').hide()
	      $('.sure-delete').show()
	      $('.cancel').show()
	      $('.sure-back').hide()
	      self.$set('callback', self.doCallback)
	      self.$set('show', true)
	    },
	    doCallback() {
	      let self = this
	      self.modalContent.callback()
	      self.$set('show', false)
	      let modalContent = {
	        title: '',
	        message: '',
	        callback: () =>{}
	      }	      
        setTimeout(()=> {
	      	self.$set('modalContent', modalContent)
        }, 300)
	    },
	    back(modalContent) {
	      let self = this
	      self.$set('modalContent', modalContent)
	      $('.tipsModalBtn').hide()
	      $('.sure-delete').hide()
	      $('.cancel').show()
	      $('.save-back').show()
	      self.$set('callback', self.doCallback)
	      self.$set('show', true)
	    },
	    imageWarn(modalContent) {
	      let self = this
	      self.$set('modalContent', modalContent)
	      $('.tipsModalBtn').hide()
        if (modalContent.type === 'FILETYPE_ERR') {
        	$('.sure-close').show()
        }
        if (modalContent.type === 'TOO_LARGE') {
          $('.press-pic-btn').show()
        }
        if (modalContent.type === 'CAT_FULL') {
          $('.sure-close').show()
        }
        if (modalContent.type === 'DELETE_FILE') {
          $('.sure-delete').show()
        	$('.cancel').show()
        }        
	      self.$set('callback', self.doCallback)
	      self.$set('show', true)
	    },
	    musicWarn(modalContent) {
	    	let self = this
	      self.$set('modalContent', modalContent)
	      $('.tipsModalBtn').hide()
	    	if (modalContent.type === 'FILETYPE_ERR') {
        	$('.sure-close').show()
        }
        if (modalContent.type === 'TOO_LARGE') {
          $('.press-music-btn').show()
        }
        if (modalContent.type === 'CAT_FULL') {
          $('.sure-close').show()
        }
        if (modalContent.type === 'DELETE_FILE') {
          $('.sure-delete').show()
        	$('.cancel').show()
        }        
	      self.$set('callback', self.doCallback)
	      self.$set('show', true)
	    }
    }
  }
</script>

