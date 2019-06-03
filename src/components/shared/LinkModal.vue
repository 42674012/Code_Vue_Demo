<template lang="jade">
modal.link-modal(:show.sync='show', effect='fade', :width='477')
  div(slot='modal-header')
  div(slot='modal-body')
    .modal-body
      p 请选择链接类型
      dropdown.dropdown
        button.btn.btn-default(data-toggle='dropdown') {{ linkTypeLabel }}
          div.caret.pull-right
        ul.dropdown-menu(slot='dropdown-menu')
          li(v-for='o in options')
            a(href='#', @click='setLinkType(o)') {{o.label}}
      .external(v-show="linkType===1")
        textarea(v-model='linkValue', v-el:textarea)
      .internal(v-show="linkType===2")
        .navigator-site-tree(v-el:tree)
  div(slot='modal-footer')
    .modal-footer
      button.btn.btn-default(@click='close()') 取消
      button.btn.btn-default.confirm(@click='confirm()') 确定

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.link-modal
  .modal-body
    padding-bottom 32px
    .dropdown
      border 1px solid #d8d8d8
      .caret
        position absolute
        top 50%
        right 10px
      button
        /*width 100%*/
        width 100px
        height 30px
        padding-right 431px
        border none
      li>a:hover
        background-color: #179eff
      .dropdown-menu
        width 100%

  .external
    width 100%
    margin-top 10px
    textarea
      width 100%
      resize vertical
      min-height 92px
      padding 10px

  .internal
    height 250px
    border 1px solid #d8d8d8
    margin-top 10px
    border-radius 5px
    overflow scroll
    .navigator-site-tree
      color #666
      .jstree-wholerow-hovered
        background #323b4b !important
        border none !important
        box-shadow none !important
        &.jstree-wholerow-clicked
          background #1a212e !important
      .jstree-wholerow-clicked
        background #323b4b !important
        border none !important
        box-shadow none !important
      .jstree-node
        input
          color #000

  .modal-footer
    button
      width 119px
      height 33px
      &.confirm
        background-color #545451
        color #fff

</style>

<style scoped>
div.modal-body > p {
  font-size: 15px;
  font-family: '微软雅黑';
  color:#333;
}
</style>

<script>

import Modal from '../widgets/Modal.vue'
import Dropdown from '../widgets/Dropdown.vue'
import config from '../../config'
import {PIC_MODEL, SLIDES_MODEL} from '../../models/data'
import fetch from 'isomorphic-fetch'
import toastr from 'toastr'
import EventListener from '../../helpers/events'

export default {
  name: 'link-modal',
  props: ['state', 'actions', 'payload', 'show'],
  data() {
    return {
      linkType: null,
      linkValue: null,
      linkTypeLabel: null,
      tree: null,

      options: [
        {
          type: 1,
          label: '站外链接'
        },
        {
          type: 2,
          label: '站内链接'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    close() {
      this.show = false
    },

    confirm() {
      if (this.linkValue) {
        this.payload.callback({
          linkType: this.linkType,
          linkValue: this.linkValue
        })
      }
      this.close()
    },

    setLinkType(o) {
      this.linkType = o.type
      this.linkTypeLabel = o.label
      this.linkValue = null
    },

    getLinkTypeLabel(linkType) {
      let label
      switch (linkType) {
        case 0:
          label = '选择链接'
          break
        case 1:
          label = '站外链接'
          break
        case 2:
          label = '站内链接'
          break
        default:
          break
      }
      return label
    },

    setLinkInternalValue(pageid) {
      this.linkValue = pageid
    }
  },

  watch: {
    show(nv) {
      if (nv) {
        this.linkType = this.payload.element.getIn(['trigger', 't'])
        this.linkValue = this.payload.element.getIn(['trigger', 'v'])
        this.linkTypeLabel = this.getLinkTypeLabel(this.linkType)
      }
    }
  },
  components: {
    modal: Modal,
    dropdown: Dropdown
  },
  ready() {
    EventListener.listen(this.$els.textarea, 'keydown', e => e.stopPropagation())
    EventListener.listen(this.$els.textarea, 'keyup', e => e.stopPropagation())

    // 选择节点事件
    $(this.$els.tree)
      .on("select_node.jstree", (e, data) => {
        if (data.node.type === 'page') { // 页面节点
          console.log(data.node.id)
          this.setLinkInternalValue(data.node.id)
        }
      })

    $(this.$els.tree).jstree({
      'core': {
        multiple: false,
        animation: 0,
        'check_callback': true,
        themes: {
          dots: false,
        },
      },
      plugins: ['changed', 'types', 'wholerow'],
      types: {
        dir: {},
        page: {
          icon: 'iconfont icon-copy'
        }
      },
    })

    setTimeout(() => {
      let siteData = this.state.get('site').toJS()
      this.tree = $(this.$els.tree).jstree(true)

      siteData.directories.forEach(dir => {
        if (dir.dirid) { // directory
          this.tree.create_node('#', {
            id: dir.dirid,
            text: dir.dirName,
            type: 'dir',
            state: {
              opened: true
            }
          })
          this.dirCount++

          let pages = dir.pages || []
          pages.forEach(page => {
            this.tree.create_node(dir.dirid, {id: page.webpageid, text: page.webpageName, type: 'page'})
          })
        } else { // page
          this.tree.create_node('#', {
            id: dir.webpageid,
            text: dir.webpageName,
            type: 'page'
          })
        }
      })
    }, 1000)

  }
}
</script>
