<template>
  <div>
    <!-- Nav tabs -->
     <ul class="nav nav-tabs" role="tablist">
        <li
            v-for="r in renderData"
            v-bind:class="{ 'active': ($index === activeIndex) }"
            @click.prevent="handleTabListClick($index, r)"
            :disabled="disabled === true"
        >
          <a href="#"> <i v-if="r.icon" :class="['iconfont', r.icon]"></i> {{r.header}}</a>
        </li>
     </ul>

     <!-- Tab panes -->
     <div class="tab-content" v-el:tabContent>
        <slot></slot>
     </div>
  </div>
</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.nav-tabs
  display flex
  display -webkit-flex
  margin-top 0
  border-bottom none

  li
    flex 1
    -webkit-flex 1
    background-color #1a212e
    border-right 1px solid #2a313e
    font-size 1.5rem

    &:last-child
      border-right none
    &.active
      /*background-color #575e67*/
      a
        border none !important
        color #0385f3 !important
        background-color transparent !important
        &:hover
         text-decoration none
        &:focus
          border none !important
          background-color transparent
    a
      border none
      text-align center
      color #fff
      margin 0
      border-radius 0
      &:hover
        text-decoration none
        background-color transparent !important
      &:focus
        border none
        background-color transparent !important
    
    .iconfont
      font-size 2rem

</style>

<script>
  export default {
    props: {
      effect: {
        type: String,
        default: 'fadein'
      }
    },
    data() {
      return {
        renderData: [],
        activeIndex: 0
      }
    },
    methods: {
      handleTabListClick(index, el) {
        if (!el.disabled) this.activeIndex = index
      }
    }
  }
</script>
