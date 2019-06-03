<template lang="jade">
modal.formlib(:show.sync='show', effect='fade', :width='850')
  div(slot='modal-header')
    .modal-header
      span.title 选择表单样式
  div(slot='modal-body')
    .modal-body
      .col-sm-3.form(@click='addForm(0)')
        img(src='../../assets/images/basicForm.png')
        .label 基础表单
      .col-sm-3.form
      .col-sm-3.form
      .col-sm-3.form
  div(slot='modal-footer')

</template>

<style lang="stylus" scoped>
@import '../../variables.styl'

.formlib
  color #545454
  .modal-header
    .title
      font-size 2rem
  .modal-body
    height 200px
    .form
      cursor pointer
      text-align center
      img
        width 100%
      .label
        margin-top 10px


</style>

<script>
import Modal from '../widgets/Modal.vue'
import config from '../../config'
import {FORM_PAGE_MODEL} from '../../models/data'

export default {
  name: 'formlib',
  props: ['state', 'actions', 'show'],
  data() {
    return {
      slugid: this.state.getIn(['editorStatus', 'slugId'])
    }
  },
  computed: {

  },
  methods: {
    addForm(mode) {
      let model = FORM_PAGE_MODEL[0]
      model.id = new Date().getTime()
      this.actions.selectElement(-1)
      this.actions.addPage(model, undefined, this.slugid)
      this.show = false
    }
  },
  components: {
    modal: Modal
  },
  ready() {

  }
}

</script>
