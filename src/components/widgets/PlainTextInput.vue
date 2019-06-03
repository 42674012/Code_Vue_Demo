<template lang="jade">
.plain-text-input
  input(:value="text",@keyup = "onValueChange",@blur = "onValueChangeEnd",@keyup.enter = "onEnterPress")
</template>

<style lang="stylus" scoped>
.plain-text-input
  display inline
  width 100%
  input
    border none
    width 100%
    padding 6px 12px

</style>

<script>

export default {
  name: 'plaintext-input',
  props: ['value', 'reg', 'changecb', 'blurcb', 'key'],
  data() {
    return {
      val:null
    }
  },
  computed: {
    text(){
      return this.value
    }
  },
  methods: {
    onValueChange(){
      let text = $(this.$el).find('input').val()
      if(this.changecb){
        this.changecb({val:text,key:this.key})
      }
    },
    onValueChangeEnd(){
      let text = $(this.$el).find('input').val()
      if(this.blurcb){
        this.blurcb({val:text,key:this.key})
      }
    },
    onEnterPress(){
      $(this.$el).find('input').blur()
    }
  },
  ready() {
    // console.log(this.value)
    // this.$set('val', this.value)
  }
}
</script>
