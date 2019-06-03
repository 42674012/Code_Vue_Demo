export const PAGE_MODEL = {
  t: 0,
  l: 0,
  h: 'auto',
  w: 640,
  crop: {
    t: 0,
    l: 0,
    w: 0,
    h: 0
  },
  elements: [],
  bgpic: '',
  bgcolor: '#ffffff',
  opacity: 0.3,
  effect: 'moveup'
}

export const PIC_MODEL = {
  "type": "pic",
  "url": "",
  "h": 568,
  "w": 320,
  "l": 40,
  "t": 60,
  "ih": 568,
  "iw": 320,
  "il": 0,
  "it": 0,
  "crop": {
    "h": 0,
    "w": 0,
    "l": 0,
    "t": 0
  },
  "rotate": 0,
  "borderradius": 0,
  "opacity": 1,
  "animation": {
    "in": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    },
    "out": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    }
  },
  "trigger": {
    on: false,
    t: 0, // 1 - 站外链接 2 - 站内链接
    v: ''
  }
}


export const SLIDES_MODEL = {
  "type": "slides",
  "h": 240,
  "w": 320,
  "l": 0,
  "t": 0,
  slides: [
    {
      url: "",
      "ih": 240,
      "iw": 320,
      "il": 0,
      "it": 0,
      "crop": {
        "h": 0,
        "w": 0,
        "l": 0,
        "t": 0
      },
      text: '',
      trigger: {
        on: false,
        t: 0, // 1 - 站外链接 2 - 站内链接
        v: ''
      }
    }
  ],
  "animation": {
    "in": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    },
    "out": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    }
  },
  active: 0,
  interval: 3,
  autoPlay: false,
  dots: true,
  text: true,
}


export const TEXT_MODEL = {
  type: 'text',
  t: 0,
  l: 0,
  w: 320,
  h: undefined,
  rotate: 0,
  opacity: 1,
  con: '编辑内容',
  animation: {
    in: {
      effect: '',
      speed: 1000,
      delay: 600
    },
    out: {
      effect: '',
      speed: 1000,
      delay: 600
    }
  },
  borderradius: 0,
  // boxshadow: 0,
  lineheight: 1.5,
  // textalign: 'center',
  color: '#909090',
  size: 20,
  bold: false,
  italic: false,
  udl: false,
  // trigger: {
  //   t: 'link',
  //   v: ''
  // }
}

export const FORM_MODEL = {
  type: 'form',
  id: 0, // 时间戳
  name: '',
  model: 0,
  t: 100,
  l: 0,
  w: 320,
  h: 350,
  borderradius: 0,
  bordercolor: '#626263',
  btncolor: '#259bff',
  btntext: '提 交',
  fontcolor: '#626263',
  feedback: '提交成功! 感谢您的参与',
  opacity: 1,
  lists: [{
    id: undefined,
    label: '姓名',
    required: true
  }, {
    id: undefined,
    label: '电话',
    required: true
  }, {
    id: undefined,
    label: '邮箱',
    required: true
  }],
  // animation: {
  //   in: {
  //     effect: '',
  //     speed: 1000,
  //     delay: 600
  //   },
  //   out: {
  //     effect: '',
  //     speed: 1000,
  //     delay: 600
  //   }
  // },
}

export const SHAPE_MODEL = {
  type: 'shape',
  t: 0,
  l: 0,
  w: 100,
  h: 100,
  rotate: 0,
  opacity: 1,
  "animation": {
    "in": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    },
    "out": {
      "effect": "",
      "delay": 600,
      "speed": 1000
    }
  },
  shape: '',
  trigger: {
    on: false,
    t: 0, // 1 - 站外链接 2 - 站内链接
    v: ''
  }

}


export const POST_MODEL = {
  type: 'post',
  t: 0,
  l: 0,
  w: 320,
  h: 510,
  size: 10,
  toutu: {
    toggle: true,
    count: 3
  },
  digest: true
}


export const HEADER_MODEL = {
  type: 'header',
  t: 0,
  l: 0,
  w: 320,
  h: 50,
  bgcolor: '',
  fontcolor: '#000',
  title: '页面标题',
  logo: {
    toggle: true,
    url: '',
    crop: {
      t: 0,
      l: 0,
      w: 0,
      h: 0
    }
  }
}


export const FOOTER_MODEL = {
  type: 'footer',
  b: 0,
  l: 0,
  w: 320,
  h: 50,
  bgcolor: '#e3e4e5',
  fontcolor: '#000',
  labelOn: true,
  menus: [{
    icon: 'fa-home',
    label: '主页',
    trigger: {
      on: true,
      t: 2, // 1 - 站外, 2 - 站内 
      v: ''
    }
  }]
}
