<template lang="jade">
.music-panel
  .panel-title
    span 音乐
  .panel-content
    .panel-row
      .music-bar
        .music-icon
          i.iconfont.icon-music(v-if="!paused", @click='togglePause')
          i.iconfont.icon-music-stop(v-else, @click='togglePause')
        .music-title(:title='projectAudio.get("name")') {{projectAudio.get('name') || '无背景音乐'}}
    .panel-row
      ul.music-list(v-el:musicList)
        li(v-for='music in systemList', @click='selectMusic(music)') {{music.musicName || '无背景音乐'}}
        li(v-for='music in myList', @click='selectMusic(music)') {{music.musicName}}
          i.iconfont.icon-stop.pull-right.text-danger(@click.stop='tryDeleteMusic(music, $index)')
    .panel-row
      button.btn.btn-defualt.upload-btn(@click='upload')
        span(v-if='!uploading')上传我的音乐
        span(v-else) 上传中... {{uploadingProgress}}%
        input(type="file", v-el:inputfile, focus, accept="audio/mpeg", @change='tryUpload')
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.panel-title
  width 100%
  height 40px
  color #fff
  line-height 40px
  text-align center
  background-color #2d353a

.panel-content
  .panel-row
    .music-bar
      position relative
      width 100%
    .music-icon
      position relative
      width 40px
      height 40px
      background-color #2d353a
      border-radius 20px
      text-align center
      cursor pointer
      z-index 1
      .icon-music
        line-height 40px
        font-size 2rem
        color #179ffe
      .icon-music-stop
        line-height 40px
        font-size 3rem
    .music-title
      position absolute
      padding-left 40px
      top 5px
      left 10px
      right 0
      height 30px
      line-height 30px
      color #fff
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      background-color #2d353a
    .music-list
      width 100%
      max-height 500px
      background-color #2d353a
      overflow-y scroll
      padding 0 10px
      li
        height 30px
        line-height 30px
        margin 5px 0
        cursor pointer
        i
          color #d43f3a
          display none
        &:hover
          i
            display block
    .upload-btn
      color #fff
      background-color #179ffe
      input
        display none




</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import {fetchMusicList} from '../../helpers/project'
import config from '../../config'
import toastr from 'toastr'

export default {
  name: 'music-panel',
  props: ['state', 'actions'],
  mixins: [elementHelper],
  data() {
    return {
      audio: window.audio,
      paused: true,
      systemList: [],
      myList: [],
      uploading: false,
      uploadingProgress: 0
    }
  },
  computed: {
    projectAudio() {
      return this.state.getIn(['project', '0', 'bgm'])
    },
  },
  methods: {
    upload() {
      this.$els.inputfile.click()
    },
    tryUpload() {
      // 检测文件大小
      let file = this.$els.inputfile.files[0]
      let fileSize = file && file.size
      if (fileSize > 2 * 1024 * 1024) {
        swal({
          title: '音乐太大了, 请不要超过2M',
          text: file.name,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: '确认',
          confirmButtonColor: '#179eff',
        }, () => {
          console.log('取消上传')
        })
      } else {
        this.uploadMusic()
      }
    },
    uploadMusic() {
      let vm = this
      this.uploading = true
      let data = new FormData()
      data.append('file', this.$els.inputfile.files[0])
      data.append('name', this.$els.inputfile.files[0].name.match(/(.*)\.(.*)$/)[1])

      $.ajax({
        type: 'POST',
        url: `${config.apiHost}/resource/music/user/uploadMusic`,
        contentType: false,
        dataType: 'json',
        data: data,
        xhrFields: {
          withCredentials: true
        },
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
          toastr.success('上传音乐成功', '', {
            positionClass: 'toast-top-center',
            timeOut: 800
          })
          vm.myList.unshift({
            musicId: data.result.musicID,
            musicName: data.result.musicName,
            musicUrl: data.result.musicUrl
          })
          vm.uploading = false
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
        vm.uploading = false
      })
      // fetch(`${config.apiHost}/resource/music/user/uploadMusic`, {
      //   method: 'post',
      //   credentials: 'include',
      //   body: data
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.status) {
      //       toastr.success('上传音乐成功', '', {
      //         positionClass: 'toast-top-center',
      //         timeOut: 800
      //       })
      //       // 成功上传后将音乐添加到我的音乐数组
      //       this.myList.unshift({
      //         musicId: data.result.musicID,
      //         musicName: data.result.musicName,
      //         musicUrl: data.result.musicUrl
      //       })
      //       this.uploading = false
      //     } else {
      //       toastr.error(data.result, '', {
      //         positionClass: 'toast-top-center',
      //         timeOut: 1000
      //       })
      //       this.uploading = false
      //     }
      //   })

    },
    getMusicList(type) {
      let apiUrl = `${config.apiHost}/resource/music/${type}/getMusics`
      return fetch(apiUrl, {
          method: 'get',
          credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            return data.result
          } else {
            toastr.error(data.result, '', {
              positionClass: 'toast-top-center',
              timeOut: 1000
            })
          }
        })
        .catch(e => {
          console.error(e)
          toastr.error('获取音乐失败')
        })
    },
    tryDeleteMusic(music, index) {
      swal({
        title: '请确认是否删除此音乐',
        text: music.musicName,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        confirmButtonColor: '#179eff',
        cancelButtonText: '取消'
      }, () => {
        this.deleteMusic(music, index)
      })
    },
    deleteMusic(music, index) {
      let apiUrl = `${config.apiHost}/resource/music/user/deleteMusic`
      let data = new FormData()
      data.append('musicID', music.musicID)
      return fetch(apiUrl, {
          method: 'post',
          credentials: 'include',
          body:data
        })
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            toastr.success('删除音乐成功', '', {
              positionClass: 'toast-top-center',
              timeOut: 800
            })
            // 成功删除后从当前数组移除
            this.myList.splice(index, 1)
          } else {
            toastr.error(data.result, '', {
              positionClass: 'toast-top-center',
              timeOut: 1000
            })
          }
        })
        .catch(e => {
          console.error(e)
          toastr.error('删除音乐失败')
        })
    },
    selectMusic(music) {
      if (music.musicUrl) {
        this.audio.src = music.musicUrl
        this.audio.play()
        this.paused = this.audio.paused
      } else {
        this.audio.src = ''
        this.paused = true
      }
      this.actions.setProject({bgm:{
        name: music.musicName,
        url: music.musicUrl
      }})
    },
    togglePause() {
      if (this.audio.paused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
      this.paused = this.audio.paused
    },
    getSystemList() {
      this.getMusicList('system').then(data => {
        this.systemList = data
        this.systemList.unshift({
          musicName: '',
          musicUrl: ''
        })
      })
    },
    getMyList() {
      this.getMusicList('user').then(data => {
        this.myList = data
      })
    }
  },
  components: {
  },
  ready() {
    $('.music-panel .music-list').niceScroll({
      cursorcolor: '#5a6267',
      cursorborder: '0px',
      cursorwidth: 5,
      // railpadding: {right: 5},
      autohidemode: false,
      horizrailenabled: false,
      railpadding: {top: 0, right: 0, left: 20, bottom: 0}
    })

    // 获取系统音乐和用户音乐
    this.getSystemList()
    this.getMyList()
    this.audio.src = this.projectAudio.get('url')

  }
}
</script>
