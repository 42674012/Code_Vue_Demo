function patchPage(pg) {
  delete pg.elementData
  delete pg.showeffect
  if (!pg.bgpic) pg.opacity = 0.3
}

function patchPic(el) {
  delete el.height
  el.rotate = parseInt(el.rotate)
  if (!el.cropData) {
    el.cropData = {
      left: 0,
      top: 0,
      width: parseInt(el.w),
      height: parseInt(el.h)
    }
  }
  if (el.pic_type) delete el.pic_type
  if (el.editable === undefined) el.editable = true
}

function patchPshape(el) {
  delete el.height
  el.rotate = parseInt(el.rotate)
  if (!el.shape || el.shape === '0') {
    el.shape = '1.svg'
  }
  el.h = el.h < 0 ? 0 : el.h
  if(el.shapecolor){
    el.colorScheme = {color1:el.shapecolor}
    delete el.shapecolor
  }
}

function patchSlide(el) {
  if (el.width) {
    el.w = parseInt(el.width, 10)
    delete el.width
  }

  if (el.height) {
    el.h = parseInt(el.height, 10)
    delete el.height
  }

  el.left = parseInt(el.left, 10)
  el.picHeight = parseInt(el.picHeight, 10)
  el.picWidth = parseInt(el.picWidth, 10)
  el.picLeft = parseInt(el.picLeft, 10)
  el.picTop = parseInt(el.picTop, 10)

  for (let slide of el.data) {
    if (slide.titleText) {
      slide.titleText.fontsize = parseInt(slide.titleText.fontsize, 10)
      slide.titleText.height = parseInt(slide.titleText.height, 10)
      slide.titleText.width = parseInt(slide.titleText.width, 10)
      slide.titleText.left = parseInt(slide.titleText.left, 10)
      slide.titleText.top = parseInt(slide.titleText.top, 10)
      slide.titleText.lineheight = parseFloat(slide.titleText.lineheight)
    }
    if (slide.contentText) {
      slide.contentText.fontsize = parseInt(slide.contentText.fontsize, 10)
      slide.contentText.height = parseInt(slide.contentText.height, 10)
      slide.contentText.width = parseInt(slide.contentText.width, 10)
      slide.contentText.left = parseInt(slide.contentText.left, 10)
      slide.contentText.top = parseInt(slide.contentText.top, 10)
      slide.contentText.lineheight = parseFloat(slide.contentText.lineheight)
    }
  }

}

import { LINK_BUTTON,PHONECALL_MODAL,COUNTDOWN_MODAL,INTERACTION_PBUTTON_MODAL } from '../models/data.js'
function patchPbutton(el) {


  function patchNormal(Patcher,El){
    Patcher.top = El.top;
    Patcher.left = El.left;
    Patcher.w = El.width;
    Patcher.h = El.height ? El.height : 80;
    Patcher.ftColor = El.ftcolor;
    Patcher.ftsize = El.ftsize;
    Patcher.opacity = El.opacity;
    Patcher.elementAnimations = El.elementAnimations;
    Patcher.show = El.show;
    Patcher.delay = El.delay;
    Patcher.speed = El.speed;
  }

  function patchTo(Patcher,El){
    for(var key in El){
      delete El[key];
    }
    for(var key in Patcher){
      El[key] = Patcher[key]
    }
  }
  


  if(el.model_type === 'link'){
    let patcher = Object.assign({}, LINK_BUTTON)
    patchNormal(patcher,el)
    patcher.bgColor = 'rgba(0,0,0,0)'
    patchTo(patcher, el)
  }
  else if(el.model_type === "interaction"){
    const btnPicToType = {
      '2.png':'flower',
      '3.png':'like',
      '4.png':'dianzan',
      '5.png':'sad'
    }
    let patcher = Object.assign({}, INTERACTION_PBUTTON_MODAL)
    patcher.button_id = new Date().getTime()
    patchNormal(patcher,el);
    patcher.bgColor = 'rgba(0,0,0,0)'
    patcher.w = null
    patcher.h = null
    patcher.funcType = btnPicToType[el.pic_id];
    patchTo(patcher, el)
  }
  
  
  else if(el.model_type === "phone"){
    let patcher = Object.assign({}, PHONECALL_MODAL)
    patchNormal(patcher,el)
    patcher.w = null
    patcher.h = null
    patcher.text = el.con
    patcher.tel = el.phoneNumber
    patcher.bgColor = 'rgba(0,0,0,0)'
    patchTo(patcher, el)
  }
  

  else if(el.model_type === "count_down"){
    let patcher = Object.assign({}, COUNTDOWN_MODAL)
    patcher.deadlineTime = Date.parse(new Date()) + 30*24*60*60*1000
    patcher.w = null
    patcher.h = null
    var str = el.deadline_date + ' ' + el.deadline_time
    str = str.replace(/-/g,"/")
    var date = new Date(str)
    patcher.deadlineTime = date.valueOf()
    patchTo(patcher, el)


  }


  
}

function patchButton(el) {
  function patchNormal(Patcher,El){
    Patcher.top = El.top;
    Patcher.left = El.left;
    Patcher.w = El.width;
    Patcher.h = El.height ? El.height : 80;
    Patcher.ftColor = El.ftcolor;
    Patcher.ftsize = El.ftsize;
    Patcher.opacity = El.opacity;
    Patcher.elementAnimations = El.elementAnimations;
    Patcher.show = El.show;
    Patcher.delay = El.delay;
    Patcher.speed = El.speed;
  }

  function patchTo(Patcher,El){
    for(var key in El){
      delete El[key];
    }
    for(var key in Patcher){
      El[key] = Patcher[key]
    }
  }
  

  let patcher = Object.assign({}, LINK_BUTTON)
  patchNormal(patcher,el)
  patcher.w = el.w
  patcher.h = el.h
  patcher.text = el.con.replace(/<\/?[^>]*>/g, "").replace(/\s*/g, "").replace(/(\n)/g, "");
  patcher.bgColor = el.bgcolor
  patchTo(patcher, el)




}

function patchPtext(el) {
  if (el.height) {
    // el.h = el.height
    el.h = undefined
    delete el.height
  }
}


function patchCharts(el) {
  if (el.height) {
    el.h = el.height
    delete el.height
  }
  if (el.width) {
    el.w = el.width
    delete el.width
  }
  if (!el.elementAnimations) {
    el.elementAnimations = {
      animation_in: {
        show: el.show,
        speed: el.speed,
        delay: el.delay
      }
    },
    delete el.show
    delete el.speed
    delete el.delay
  }
}

function patchForm(el){
  for(var i in el.qlist){
    if(el.qlist[i]['$$hashKey']){
      delete el.qlist[i]['$$hashKey']
    }
  }
  console.log(el)
}

export default function (json) {

  let pages = json.entities.pages
  let elements = json.entities.elements

  // patch pages
  for (let id in pages) {
    patchPage(pages[id])
  }

  // patch elements
  for (let id in elements) {
    let el = elements[id]
    switch (el.type) {
      case 'pic':
        patchPic(el)
        break
      case 'pshape':
        patchPshape(el)
        break
      case 'text':
      case 'ptext':
        patchPtext(el)
        break
      case 'charts':
        patchCharts(el)
        break
      case 'pButton':
        patchPbutton(el)
        break
      case 'btn':
        patchButton(el)
        break
      case 'eleform':
        patchForm(el)
        break;    
      case 'slide':
        patchSlide(el)
        break
      default:
        break
    }
  }

  return json

}
