<template lang="jade">
div.TemplateLib
  div.NavBar
    div.NavItem(v-for='(key, val) in TemplateLibConfig.navItems',:class="{ active: key == selectedNav }", @click='selectNav(key)' ) {{val.name}}
  div.SubNavBar(v-if='hasSubNav')
    table(style='width:100%;height:100%')
      tr
        td.SubNavItem(v-for='(key, val) in TemplateLibConfig.navItems[selectedNav].subNav', @click='selectSubNav(key)', )
          .subnav-title(:class='{ active: key == selectedSubNav}') {{val.name}}

  div.loadingArea(v-if='TemplateLoading')
    loading

  div.TemplateArea(:class="{ hasSubNav: hasSubNav }")
    // div.TemplateItem(v-if='parseInt(selectedNav) === 0 && parseInt(selectedSubNav) === 0')
    div.TemplateItem(v-for='(key, value)  in TemplateData')
      img(:src='value.firstImgUrl | firstImageCompress', @click='selectTemplate(value)', @dblclick='confirm')

</template>

<style lang="stylus" scoped>
@import "../../variables.styl"

.TemplateLib
  width 330px
  position fixed
  left 0
  top 60px
  bottom 0
  height 100%
  background #E9E9E9
  z-index 999
  border 1px solid $grid-border-color
  border-top 0px
  // box-shadow 0 0 1px gray

.NavBar
  width 100%
  height 50px
  position relative
  border-bottom 1px solid rgba(20,20,20,0.1)

.NavItem
  width 33.3%
  float left
  text-align center
  line-height 50px
  height 50px
  color $darker-font-color
  cursor pointer
  &.active
    border-bottom 3px solid $text-level-1
    color $text-level-1

.SubNavBar
  width 100%
  height 40px
  position relative
  top 0
  border-bottom 1px solid rgba(20,20,20,0.1)

.SubNavItem
  text-align center
  color $text-level-1 
  cursor pointer

  .subnav-title
    width 80%
    border-radius 20px
    &.active
      color #fff
      background-color $button-background
.TemplateLoading
  text-align center
  line-height 200px

.loadingArea
  width 100%
  height 100%
  position relative
  text-align center

  .loading
    margin-top 36px
    display inline-block

.TemplateArea
  width 330px
  position absolute
  top 60px
  bottom 0
  padding-bottom 50px
  &.hasSubNav
    top 100px

.TemplateItem
  float left
  width 150px
  height 237 px
  background white
  margin-top 8px
  margin-left 10px
  img
    width 100%
    user-drag none
    -webkit-user-drag none

</style>

<script>
import config from '../../config'
import Loading from '../widgets/Loading.vue'

var TemplateLibConfig = {}
var templateData = {}

export default {
  props: ['state','actions'],
  data() {
    return {
      TemplateLibConfig: TemplateLibConfig,
      TemplateData:{},
      TemplateLoading: true,
      hasSubNav:true,
      selectedNav:0,
      selectedSubNav:0,
      hasSelected: false
    };
  },
  components: {
    'loading': Loading
  },
  beforeCompile() {
    TemplateLibConfig = {
      navItems:{
      0:{
        name:i18next.t('templateLib:normalTemplate'),
        subNav:{
          0: {
            name:i18next.t('templateLib:all'),
            json: config.api.templates + '?cateId=5&dataType=pdata&perPage=100'
          },
          1: {
            name:i18next.t('templateLib:cover'),
            json: config.api.templates + '?cateId=9&dataType=pdata&perPage=100'
          },
          2: {
            name:i18next.t('templateLib:picText'),
            json: config.api.templates +  '?cateId=imageText&dataType=pdata&perPage=100'
          },
          3: {
            name:i18next.t('templateLib:slides'),
            json: config.api.templates + '?cateId=62&dataType=pdata&perPage=100'
          },
          4: {
            name:i18next.t('templateLib:form'),
            json: config.api.templates + '?cateId=6&dataType=pdata&perPage=100'
          }
        }
      },
      1:{
        name:i18next.t('templateLib:statisticTemplate'),
        json: config.api.templates + '?cateId=7&dataType=pdata&perPage=100'
      },
      2:{
        name:i18next.t('templateLib:effectTemplate'),
        json: config.api.templates + '?cateId=8&dataType=pdata&perPage=100'
      }
    }
    }
    
    this.$set('TemplateLibConfig', TemplateLibConfig)

  },
  methods: {
    selectNav(id){
      this.$set('selectedNav', id)
      this.$set('hasSubNav',TemplateLibConfig.navItems[id].subNav)

      if(TemplateLibConfig.navItems[id].subNav){
        this.selectSubNav(0);
      }
      else{
        let subId = 'all'
        this.$set('selectedSubNav', subId)
        this.getTemplateData(id, subId, TemplateLibConfig.navItems[id].json)
      }
    },
    patchTemplate(template) {
      for (let o of template.content) {
        // patch element's animation
        o.elementAnimations = {
          animation_in: {}, 
          animation_on: {show: 'noeffect', speed: 0, delay: 0, iteration_count: 3}, 
          animation_out: {show: 'noeffect', speed: 0, delay: 0}, 
        }
        o.elementAnimations.animation_in.show = o.show
        o.elementAnimations.animation_in.speed = o.speed
        o.elementAnimations.animation_in.delay = o.delay

        // patch boxshadow
        if (o.boxshadow === undefined) o.boxshadow = 0
      }
      return template
    },
    selectTemplate(data){
      let vm = this
      let pageid = this.state.getIn(['editorStatus', 'selectedPageId'])
      let pages = this.state.getIn(['project', '0', 'json'])
      let pageindex = pages.indexOf(pageid)
      let slugid = this.state.getIn(['editorStatus', 'slugId'])
      let template = data.pdata.json[0]
      template = this.patchTemplate(template)

      this.actions.undo()
      this.actions.addPage(template, pageindex, slugid)
      // 完成触发元素动作
      this.$nextTick(function () {
        vm.$dispatch('ANIMATE_SHOW', null)
      })
    },
    selectSubNav(id){
       this.$set('selectedSubNav', id)
       let url = TemplateLibConfig.navItems[this.$get('selectedNav').toString()].subNav[id.toString()].json
       this.getTemplateData( this.$get('selectedNav'), id, url)
    },

    getTemplateData(navId,subId,url){
      if(!templateData[navId]){
        templateData[navId] = {}
      }
      if(!templateData[navId][subId]){
        templateData[navId][subId] = {}
      }

      if(templateData[navId][subId].loadEnd || templateData[navId][subId].loading){
        this.$set('TemplateLoading', false);
        this.$set('TemplateData', templateData[navId][subId].TempList);
        return;
      }
      else{
        this.$set('TemplateLoading', true)
        this.$set('TemplateData', [])
        templateData[navId][subId].loadEnd = false
        templateData[navId][subId].loading = false
        var self = this;
        templateData[navId][subId].url = url
        this.fetchTemplate(url,templateData[navId][subId],function(){
          if((self.$get('selectedNav') !== navId) || self.$get('selectedSubNav') !== subId) {
            return;
          }
          self.$set('TemplateLoading', false);
          self.$set('TemplateData', templateData[navId][subId].TempList);
        })
      }
    },

    fetchTemplate(url,obj,cb){
      obj.loading = true;
       $.ajax({
         url: url,
         type: 'GET',
         dataType: 'json'
       })
       .done(function(data) {
         obj.loadEnd = true
         obj.TempList = data.data.dataList
         cb()
       })
       .fail(function() {
         console.log("error")
       })
       .always(function() {
         obj.loading = false
       });
    },

    confirm() {
      this.actions.toggleTemplateLib(false)
    }
  },
  ready() {
    // console.log(TemplateLibConfig)
    let el = $(this.$el).find('.TemplateArea')
    el.niceScroll({
      cursorcolor: 'rgba(138,138,138,1)',
      railalign: 'right',
      autohidemode: 'scroll',
      horizrailenabled: false,
      cursoropacitymin:0.5,
      cursorwidth:10
    })
    this.selectNav(0)
  }
}
</script>
