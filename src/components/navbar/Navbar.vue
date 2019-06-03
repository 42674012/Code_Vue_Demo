<template lang="jade">
.navbar
  navbar-left(:state='state', :actions='actions')
  // navbar-center(:state='state', :actions='actions')
  navbar-right(:state='state', :actions='actions')
</template>

<style lang="stylus" scoped>

.navbar
  position fixed
  border-radius 0px
  border none
  width 100%
  height 60px
  background-color #000
  z-index 102
</style>

<script>
import NavbarLeft from './NavbarLeft.vue'
// import NavbarCenter from './NavbarCenter.vue'
import NavbarRight from './NavbarRight.vue'

export default {
  name: 'navbar',
  props: ['state', 'actions'],
  components: {
    navbarLeft: NavbarLeft,
    // navbarCenter: NavbarCenter,
    navbarRight: NavbarRight
  }
}
</script>
