<template lang="jade">
.trigger-panel
  .panel-content
    .panel-row 单击当前控件时
    .panel-row
      dropdown.dropdown
        button.btn.btn-default(data-toggle='dropdown') {{triggerTypes[trigger.get('t')]}}
          div.caret.pull-right
        ul.dropdown-menu(slot='dropdown-menu')
          li(v-for='(k, v) in triggerTypes', track-by='$index')
            a(href='#', @click='selectTriggerType(k)') {{v}}
    .panel-row(v-if='trigger.get("t") === "link"')
      .to-link
        p 请添加外链
        input(type='text', v-model='triggerLink', lazy)
    .panel-row(v-if='trigger.get("t") === "page"')
      .to-page
        p 请选择跳转页面
        dropdown.dropdown
          button.btn.btn-default(data-toggle='dropdown') 页面{{trigger.get('v') + 1}}
            div.caret.pull-right
          ul.dropdown-menu(slot='dropdown-menu')
            li(v-for='p in pages', track-by='$index')
              a(href='#', @click='selectTriggerPage($index)') 页面{{$index + 1}}


</template>

<style lang="stylus" scoped>
@import '../../variables.styl'
@import '../../assets/app.styl'

.trigger-panel
  .dropdown
    width 100%
    .caret
      font-size 1rem
      position absolute
      top 50%
      right 10px
    button
      height 30px
      width 100%
    ul
      width 100%
      li>a:hover
        background-color: #179eff
  .to-link
    width 100%
</style>

<script>
import elementHelper from '../../mixins/elementHelper'
import Dropdown from '../widgets/Dropdown.vue'

export default {
  name: 'trigger-panel',
  props: ['state', 'actions', 'elementid', 'element'],
  mixins: [elementHelper],
  data() {
    return {
      pages: this.state.getIn(['project', '0', 'pages']).toJS(),
      triggerTypes: {
        link: '跳转到链接',
        page: '跳转到其他页面'
      }
    }
  },
  computed: {
    trigger() {
      return this.element.get('trigger')
    },
    triggerLink: {
      get() {
        return this.trigger.get('v')
      },
      set(value) {
        this.actions.setElementUndoable(this.elementid, {
          trigger: {t: 'link', v: value}
        })
      }
    },
  },
  methods: {
    selectTriggerType(t) {
      if (t === 'link') {
        this.actions.setElementUndoable(this.elementid, {
          trigger: {t: 'link', v: ''}
        })
      } else if (t === 'page') {
        this.actions.setElementUndoable(this.elementid, {
          trigger: {t: 'page', v: 0}
        })
      }
    },
    selectTriggerPage(index) {
      this.actions.setElementUndoable(this.elementid, {
        trigger: {t: 'page', v: index}
      })
    }
  },
  components: {
    'dropdown': Dropdown

  }
}
</script>
