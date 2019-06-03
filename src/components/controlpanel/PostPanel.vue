<template lang="jade">
.post-panel
  tabs.tabs
    tab(header='设置')
      .panel-content
        .panel-row.page-effect
          span 栏目选择
          dropdown.dropdown
            button.btn.btn-default(data-toggle='dropdown') {{element.getIn(['column', 'name'])}}
              div.caret.pull-right
            ul.dropdown-menu(slot='dropdown-menu')
              li(v-for='c in columns')
                a(href='#', @click='setColumn(c)') {{c.columnname}}
        .panel-row.page-effect
          span 加载条数
          dropdown.dropdown
            button.btn.btn-default(data-toggle='dropdown') {{element.get('size')}}
              div.caret.pull-right
            ul.dropdown-menu(slot='dropdown-menu')
              li(v-for='s in sizes')
                a(href='#', @click='setSize(s)') {{s}}
        .panel-row.page-effect
          span 开启头图
          toggle(:value="toutuOn", :callback="toggleTou", style='width: 170px')
        .panel-row.page-effect(v-show="toutuOn")
          span 头图条数 
          dropdown.dropdown
            button.btn.btn-default(data-toggle='dropdown') {{element.getIn(['toutu', 'count']) + '条'}}
              div.caret.pull-right
            ul.dropdown-menu(slot='dropdown-menu')
              li(v-for='s in slides')
                a(href='#', @click='setToutu(s)') {{s}}
        .panel-row.line
        .panel-row
          .digest.no(:class='{active: !digest}', @click='setDigest(false)')

        .panel-row
          .digest(:class='{active: digest}', @click='setDigest(true)')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.post-panel
  .panel-row
    color #fff 
    &.page-effect
      span
        line-height 30px
        
    .dropdown
      .caret
        color #575e67
        position absolute
        top 50%
        right 10px
      button
        text-align left
        color #575e67
        background-color #fff
        width 170px
        height 30px
        border none

      li>a:hover
        background-color: #179eff
    
    .digest
      width 100%
      height 100px
      background-color #1a202e
      border-radius 5px
      background-image url(../../assets/images/style-digest.png)
      background-position center center
      background-repeat no-repeat
      &.no
        background-image url(../../assets/images/style-no-digest.png)
      &.active
        background-color #0e85ff

</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import AnimationPanel from './AnimationPanel.vue'
import Dropdown from '../widgets/Dropdown.vue'
import ToggleButton from '../widgets/ToggleButton.vue'
import config from '../../config'
import fetch from 'isomorphic-fetch'
import { getToken, getProjectId } from '../../helpers/common'

export default {
  name: 'post-panel',
  mixins: [elementHelper],
  props: ['state', 'actions', 'elementid', 'element'],
  data() {
    return {
      columns: [],
      sizes: [10, 15, 20],
      slides: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    toutuOn() {
      return this.element.getIn(['toutu', 'toggle'])
    },
    digest() {
      return this.element.get('digest')
    }
  },
  methods: {
    setColumn(c) {
      this.actions.setElementUndoable(this.elementid, {
        column: {
          id: c.columnid,
          name: c.columnname
        } 
      })
    },
    setSize(s) {
      this.actions.setElementUndoable(this.elementid, { size: s })
    },
    setToutu(s) {
      this.actions.setElementUndoable(this.elementid, { toutu: {count: s} })
    },
    toggleTou(val) {
      this.actions.setElementUndoable(this.elementid, {
        h: val ? 510 : 330,
        toutu: {toggle: val}
      })
    },
    setDigest(val) {
      this.actions.setElementUndoable(this.elementid, {
        digest: val
      })
    }
  },
  components: {
    'tabs': Tabset,
    'tab': Tab,
    'animation-panel': AnimationPanel,
    'dropdown': Dropdown,
    'toggle': ToggleButton
  },
  ready() {
    
    fetch(`${config.apiHost}/builderArticleColumn/getColumnbyProjectid/${getToken()}/${getProjectId()}`)
      .then(res => res.json())
      .then(res => {
        this.columns = res.data
      })
  }
}
</script>
