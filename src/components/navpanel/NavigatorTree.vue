<template lang="jade">
.navigator-tree
 .panel-content
    .panel-title 页面列表
      button.btn.btn-link(@click='addNode(0)')
        i.iconfont.icon-iconxinjianwenjianjia
      button.btn.btn-link(@click='addNode(1)')
        i.iconfont.icon-xinjiantianjiabiaodanyemian
    .navigator-site-tree(v-el:tree)

   

</template>

<style lang="stylus">
@import "../../variables.styl"

.navigator-tree
  .panel-content
    padding 10px
  
  .panel-title
    width 100%
    height 50px
    line-height 50px
    color #eee
    border-bottom 1px solid #484f5c
    margin-bottom 10px
    button
      height 50px
      float right
      color #eee
      text-decoration none
      
      .iconfont
        height 50px
        align-text center
      &:hover
        color #0385f3
    
  .navigator-site-tree
    color #eee
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

.jstree-contextmenu
  z-index 999 !important
</style>

<script>

import uuid from 'uuid'
import config from '../../config'
import fetch from 'isomorphic-fetch'
import {
  getToken,
  getProjectId
} from '../../helpers/common'
import EventListener from '../../helpers/events'

  
export default {
  name: 'navigator-tree',
  props: ['state', 'actions'],
  data() {
    return {
      siteData: this.state.get('site').toJS(),
      tree: null,
      currentNode: null,
      dirCount: 0
    }
  },
  computed: {
   
  },
  events: {
    'DUPLICATE_PAGE': function (pl) {
      this.addNode(true, true)
    }
  },
  methods: {
    addNode(flag, duplicate) {
      if (flag) {
        // 添加页面，只允许在根或者文件夹下添加
        console.log(this.currentNode)
        let parentNode = this.currentNode 
        if (parentNode && parentNode.type === 'page') {
          parentNode = this.tree.get_node(parentNode.parent) 
          parentNode = parentNode.id === '#' ? null : parentNode
        }
        let bodydata = new FormData()
        bodydata.append('builderprojectid', getProjectId())
        bodydata.append('webpagename', duplicate ? this.currentNode.text + '_副本' : '新页面')
        if (parentNode) bodydata.append('parentid', parentNode.id)
        fetch(`${config.apiHost}/BuilderWebpageDraft/newEmptyPage/${getToken()}`, {
          method: 'POST',
          body: bodydata
        })
        .then(res => res.json())
        .then(res => {
          this.tree.create_node(parentNode, {
            id: res.data.webpageid,
            text: res.data.webpagename,
            type: 'page',
            icon: 'iconfont icon-copy'
          })

          if (duplicate) this.$dispatch('DUPLICATE_SAVE', {
            pageid: res.data.webpageid,
            pagename: res.data.webpagename
          })
        })
      } else { // 添加文件夹只允许在根添加
        let bodydata = new FormData()
        bodydata.append('builderprojectid', getProjectId())
        bodydata.append('webpagename', '新文件夹')
        fetch(`${config.apiHost}/BuilderWebpageDraft/newEmptyDir/${getToken()}`, {
          method: 'POST',
          body: bodydata 
        })
        .then(res => res.json())
        .then(res => {
          this.tree.create_node(null, {
            id: res.data.webpageid,
            text: res.data.webpagename,
            type: 'dir'
          }, this.dirCount)
        })
      }
    },
    
    deleteNode(node) {
      let nodejson = this.tree.get_json(node)
      let bodydata = new FormData()
      bodydata.append('webpageid', nodejson.id)
      
      let apiPart = 'deleteDraftPage'
      if (nodejson.type === 'dir') apiPart = 'deleteDraftDir'
      fetch(`${config.apiHost}/BuilderWebpageDraft/${apiPart}/${getToken()}`, {
        method: 'POST',
        body: bodydata 
      })
      .then(res => res.json())
      .then(res => {
        console.debug(`delete node ${nodejson.id}, ${res.data}`)
        this.tree.delete_node(node)
      })
    },
    
    updateNode(node) {
      let bodydata = {
        webpageid: node.id,
        webpagename: node.text
      }
      let apiPart = 'updateDraftPageName'
      if (node.type === 'dir') apiPart = 'updateDraftDir'

      fetch(`${config.apiHost}/BuilderWebpageDraft/${apiPart}/${getToken()}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodydata)
      })
      .then(res => res.json())
      .then(res => {
        console.debug(`update node ${node.id} success`)
      })

    }
    
  },
  ready() {
    // 选择节点事件
    $(this.$els.tree)
      .on("select_node.jstree", (e, data) => {
        this.currentNode = data.node
        if (this.currentNode.type === 'page') { // 页面节点
          this.actions.selectElement(-1)
          this.actions.fetchPageData(this.currentNode.id)
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
      plugins: ['contextmenu', 'changed', 'types', 'wholerow'],
      types: {
        dir: {},
        page: {
          icon: 'iconfont icon-copy'
        }
      },
      contextmenu: {
        select_node: false,
        items: {
          delete: {
            label: '删除',
            action: (data) => {
              this.deleteNode(data.reference)
            }
          },
          add: {
            label: '新增',
            action: (data) => {
              let node = data.reference
              if (this.tree.get_type(node) === 'dir') {
                let newNode = this.tree.create_node(this.currentNode, {id: uuid.v4(), text: '新页面', type: 'page'})
                this.tree.edit(this.tree.get_node({id: newNode}))
              } else {
                let newNode = this.tree.create_node('#', {id: uuid.v4(), text: '新页面', type: 'page'})
                this.tree.edit(this.tree.get_node({id: newNode}))
              }
            }
          },
          rename: {
            label: '改名',
            action: (data) => {
              this.tree.edit(data.reference, null, (node) => {
                this.updateNode(node)
              })
            }
          }

        }
      },

    })
    let vm = this

    setTimeout(() => {
      this.tree = $(vm.$els.tree).jstree(true)

      vm.siteData.directories.forEach(dir => {
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

      this.tree.select_node(this.siteData.lastUpdatedPageId)
    })
    
    EventListener.listen(this.$el, 'keydown', e => e.stopPropagation())
    EventListener.listen(this.$el, 'keyup', e => e.stopPropagation())
  }

}
</script>
