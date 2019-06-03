<template lang="jade">
.navbar-l
  .logo
    img(src='../../assets/images/logo2.PNG')
  //.back
    a.pull-right(@click='back') < 返回我的项目

</template>

<style lang="stylus" scoped>

.navbar-l
  display flex
  position absolute
  left 0
  height 100%
  width 300px

  .logo
    flex 1
    margin-left 20px
    margin-top 15px
    max-width 100px
    img
      width 100%
      -webkit-user-drag none

  .back
    flex 1
    color #fff
    height 100%
    a
      line-height 60px
      color #fff
      cursor pointer
      &:hover
        text-decoration none



</style>

<script>
import config from '../../config'
import { getProjectId } from '../../helpers/common'
import denormalize from '../../helpers/denormalize'
import {save} from '../../helpers/project'


export default {
  name: 'navbar-left',
  props: ['state', 'actions'],
  methods: {
    back() {
      swal({
        title: '是否返回到我的项目',
        text: '项目将保存',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        confirmButtonColor: '#179eff',
        cancelButtonText: '取消'
      }, () => {
        save(this.state, this.actions).then(() => {
          window.location.href=`${config.host}/user-profile.html`
        })
      })
    }
  }
}
</script>
