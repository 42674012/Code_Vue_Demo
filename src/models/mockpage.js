export const page = {
    "id": "abc", // 项目id
    "uid": 123, // 用户id
    "title": "abc", // 项目标题
    "description": "abc", //项目描述
    "version": 123, // 版本
    "qrcode": "url", // 二维码图片地址
    "thumb": "url", // 缩略图
    "bgm": {
        "name": "abc",
        "url": "url"
    }, // 背景音乐
    "bgcolor": "#ffffff", // 背景颜色
    "opacity": 0.5, // 背景颜色透明度
    "bgpic": "url", // 背景图片
    "h": 1235, // 背景图片高
    "w": 700, // 背景图片宽
    "l": -40, // 背景图片相对画布的x位移
    "t": 0, // 背景图片相对画布的y位移
    "crop": { // 背景图片裁剪数据
        "h": 0,
        "w": 0,
        "l": 20,
        "t": 0
    },
    "header": {//顶部标题
        "show": true,
        "text": "abc",
        "textcolor": "#ffffff",
        "bgcolor": "#ffffff",
        "logo": {
            "show": true,
            "url": "url"
        }
    },
    "footer": {//底部导航
        "show": true,
        "bgcolor": "#ffffff",
        "item": [{//导航项
            "text": "abc",
            "icon": "class",
            "color": "#ffffff",
            "trigger": {
                "t": "link"
            }
        }]
    },
    "article": {//尾部文章列表
        "show": true,
        "id": "abc",
        "thumb": true,
        "top": 3,
        "num": 10
    },
    "elements": [{
        "type": "pic", // 元素类型
        "url": "", // 图片url
        "h": 400, // 高
        "w": 300, // 宽
        "l": 40, // x
        "t": 60, // y
        "ih": 400, // 图片高
        "iw": 300, // 图片宽
        "il": 40, // 图片x
        "it": 60, // 图片y
        "crop": { // 图片裁剪数据
            "h": 0,
            "w": 0,
            "l": 20,
            "t": 0
        },
        "rotate": 60, // 旋转
        "borderradius": 60, // 图片圆角
        "opacity": 0.6, // 图片透明度
        "animation": {
            "in": { // 进场动画
                "effect": "", // 动画效果
                "delay": 600, // 延迟毫秒
                "speed": 1000 // 速度毫秒
            }
        },
        "trigget": {
            "t": "link" // 触发类型，link或page
        }
    }, {
            "type": "text", // 文字元素
            "t": 397,
            "l": 124,
            "w": 400,
            "h": 0,
            "rotate": 0,
            "opacity": 1,
            "con": "编辑内容",
            "animation": {
                "in": {
                    "effect": "",
                    "speed": 1000,
                    "delay": 600
                }
            },
            "borderradius": 0,
            "lineheight": 1.5,
            "textalign": "center",
            "color": "#909090",
            "size": 40,
            "bold": false,
            "italic": false,
            "udl": false,
            "trigger": {
                "t": "link"
            }
        }, {
            "type": "form",
            "id": 0, // 时间戳
            "model": 0, // 表单类型
            "t": 100,
            "l": 0,
            "w": 640,
            "h": 700,
            "borderradius": 0,
            "bordercolor": "#626263",
            "btncolor": "#259bff",
            "btntext": "提 交",
            "fontcolor": "#626263",
            "feedback": "",
            "opacity": 1,
            "lists": [{ //输入框数据
                "label": "姓名",
                "required": true
            }, {
                    "label": "电话",
                    "required": true
                }, {
                    "label": "邮箱",
                    "required": true
                }],
            "animation": {
                "in": {
                    "effect": "",
                    "speed": 1000,
                    "delay": 600
                }
            }
        }, { // 图集元素
            "type": "slides",
            "h": 568,
            "w": 320,
            "l": 40,
            "t": 60,
            "slides": [{ // 图集元素的图片组
                "url": "",
                "ih": 568,
                "iw": 320,
                "il": 0,
                "it": 0,
                "crop": {
                    "h": 0,
                    "w": 0,
                    "l": 0,
                    "t": 0
                }
            }],
            "animation": {
                "in": {
                    "effect": "",
                    "delay": 600,
                    "speed": 1000
                }
            },
            "active": 0, // 渲染无需理会改字段
            "autoPlay": false, // 是否自动播放
            "dots": true // 是否显示轮播点
        }, { // 形状元素
            "type": "shape",
            "t": 50,
            "l": 220,
            "w": 200,
            "h": 200,
            "rotate": 0,
            "opacity": 1,
            "animation": {
                "in": {
                    "effect": "",
                    "delay": 600,
                    "speed": 1000
                }
            },
            "shape": "圆形.svg",
            "trigger": {
                "t": "link"
            },
            "colors": { // 颜色组，每一项代表一种颜色
                "c1": "#179EFF"
            }
        }
    ]
}