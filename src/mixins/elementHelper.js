export default {
  methods: {
    px(n) {
      return parseInt(n) + 'px'
    },

    deg(n) {
      return `rotate(${n}deg)`
    },

    url(s) {
      return `url(${s})`
    },

    percent(n) {
      return `${Math.round(n * 100)}%`
    },

    xScale(sx, sy) {
      sx = sx ? sx : 1
      sy = sy ? sy : 1

      return `scale(${sx}, ${sy})`
      // return `matrix(${sx}, 0, 0,${sy}, 0, 0)`
    },

    xRotate(deg) {
      deg = deg ? deg : 0
      return `rotate(${deg}deg)`
      // return `matrix(${Math.cos(alpha)}, ${Math.sin(alpha)}, ${-Math.sin(alpha)}, ${Math.cos(alpha)}, 0, 0)`
    },

    xScale3d(sx, sy) {
      return `matrix3d(${sx}, 0, 0, 0, 0, ${sy}, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`
    },

    xRotate3d(deg) {
      let alpha = Math.PI * deg / 180
      return `matrix3d(${Math.cos(alpha)}, ${Math.sin(alpha)}, 0, 0, ${-Math.sin(alpha)}, ${Math.cos(alpha)}, 0, 0, 0, 0, 1, 0, 0, 0 , 0, 1)`
    },

    animateShow(vm) {
      let animation = {
        in_show: vm.element.getIn(['animation', 'in', 'effect']),
        in_speed: vm.element.getIn(['animation', 'in', 'speed']),
        in_delay: vm.element.getIn(['animation', 'in', 'delay']),
        out_show: vm.element.getIn(['animation', 'out', 'effect']),
        out_speed: vm.element.getIn(['animation', 'out', 'speed']),
        out_delay: vm.element.getIn(['animation', 'out', 'delay'])
      }
      let outerEle = $(vm.$el).find('.outer-element')[0]
      let slugid = $(vm.$el).find('.wrapper-element').attr('slugid')
      let isSelected = parseInt(slugid) == vm.state.getIn(['editorStatus', 'selectedElementId'])

      $(vm.$el).find('.operate').hide()

      $(outerEle).css({
        animation: animation.in_show + ' ' + animation.in_speed / 1000 + 's ease ' + animation.in_delay / 1000 + 's both',
        '-webkit-animation-play-state': 'running',
        'animation-play-state': 'running'
      }).addClass('animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (){
        $(outerEle).css({
          animation: animation.out_show + ' ' + animation.out_speed / 1000 + 's ease ' + animation.out_delay / 1000 + 's both',
          '-webkit-animation-play-state': 'running',
          'animation-play-state': 'running'
        }).addClass('animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (){
          $(outerEle).css({'animation':''})
          if (isSelected) $(vm.$el).find('.operate').show()
        })
      })
    }
  }
}
