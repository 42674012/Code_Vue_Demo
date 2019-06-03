<template lang="jade">
.navigator-panel
  tabs.tabs
    tab(header="页面", icon="icon-yemiansolid")
      navigator-tree(:state='state', :actions='actions')
    tab(header="组件", icon="icon-yemian24")
      navigator-component(:state='state', :actions='actions')
</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.navigator-panel
  position absolute
  width 320px
  height 100%
  background-color #2a313e
</style>

<script>
import Tab from '../widgets/Tab.vue'
import Tabset from '../widgets/Tabset.vue'
import NavigatorComponent from './NavigatorComponent.vue'
import NavigatorTree from './NavigatorTree.vue'
import uuid from 'uuid'

export default {
  name: 'navigator-panel',
  props: ['state', 'actions'],
  data() {
    return {
    }
  },
  components: {
    'tabs': Tabset,
    'tab': Tab,
    'navigator-component': NavigatorComponent,
    'navigator-tree': NavigatorTree
  }
}
</script>
