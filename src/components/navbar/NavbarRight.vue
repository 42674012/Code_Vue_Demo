<template lang="jade">
.navbar-r
  .save(@click='save()')
    .wrap
      span
        i.iconfont.icon-save
      span 保存
  .preview(@click='preview')
    .wrap
      span
        i.iconfont.icon-preview
      span 预览
  .publish(@click='publish')
    .wrap
      span
        i.iconfont.icon-publish
      span 发布
  publish(:state='state', :actions='actions', :show.sync='showPublish')
  //
    publish(:state='state', :actions='actions', :show.sync='showPublish')
    preview(:state='state', :actions='actions', :show.sync='showPreview')

</template>

<style lang="stylus" scoped>

.navbar-r
  display flex
  position absolute
  width 300px
  height 100%
  right 0
  .preview, .save, .publish
    flex 1
    cursor pointer
    color #fff
    &:hover
      background-color #1b75be
    .wrap
      text-align center
      span
        line-height 60px
      span:last-child
        margin-left 3px
</style>

<script>
import config from '../../config'
import { getProjectId } from '../../helpers/common'
import denormalize from '../../helpers/denormalize'
import { save } from '../../helpers/project'
import fetch from 'isomorphic-fetch'
import Publish from '../shared/Publish.vue'
// import Preview from './Preview.vue'
import EventListener from '../../helpers/events'

// function checkstatus(res) {
//   if (res.status >= 200 && res.status < 300) {
//     return res
//   } else {
//     let error = new Error(res.statusText)
//     error.response = res
//     throw error
//   }
// }

export default {
  name: 'navbar-right',
  props: ['state', 'actions'],
  data() {
    return {
      showPublish: false,
      showPreview: false
    }
  },
  events: {
    // 自动保存
    'AUTO_SAVE': function () {
      this.save()
    },
    // 复制页面保存
    'DUPLICATE_SAVE': function (pl) {
      this.save(pl)
    }
  },
  methods: {
    preview() {
      // save(this.state, this.actions).then(() => {
      //   setTimeout(() => {
      //     this.showPreview = true;
      //   }, 100)
      // })
    },
    save(payload) {
      save(this.state, this.actions, payload)
    },

    publish() {
      save(this.state, this.actions).then(() => {
        setTimeout(() => {
          this.showPublish = true;
        }, 100)
      })
    }
  },
  components: {
    publish: Publish,
    // preview: Preview
  },
  ready() {
    // prevent keydown keyup event from propagation
    EventListener.listen(this.$el, 'keydown', e => e.stopPropagation())
    EventListener.listen(this.$el, 'keyup', e => e.stopPropagation())
  }
}
</script>
