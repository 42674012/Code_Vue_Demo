<template lang="jade">
div.container.loading
  div.logo
  div.title
    玩命加载中...
</template>

<style lang="stylus" scoped>
.loading
  width 100%
  height 100%
  .title
    font-size 1.5rem
    position absolute
    text-align center
    width 500px
    margin-left -250px
    left 50%
    top 60%
</style>

<script>
export default {
  name: 'loading',
  data() {
    return {
    }
  }
}

</script>
