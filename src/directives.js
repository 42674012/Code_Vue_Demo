import Vue from 'vue'
import Quill from 'quill'

Vue.directive('quill', {
  params: ['toolbar'],
  bind() {
    // this.vm.editor = new Quill(this.el)
    this.vm.editor = new Quill(this.el, {
      modules: {
        toolbar: [
          // [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          ['link'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }], 
          [{ 'color': [] }, { 'background': [] }],
        ]
      },
      theme: 'snow' // or 'bubble''
    })
    
    if (this.arg === 'text') {
      // this.vm.editor.addModule('toolbar', { container: this.params.toolbar });
      this.vm.editor.root.innerHTML = this.vm.element.get('con')
      this.vm.editor.on('text-change', (delta, oldDelta, source) => {
        let innerHTML = this.vm.editor.root.innerHTML
        this.vm.actions.setElement(this.vm.elementid, {con: innerHTML})
      })

      // this.vm.editor.on('text-change', (delta, source) => {
      //   if (source === 'user') {
      //     this.vm.actions.setElement(this.vm.elementid, {con: this.vm.editor.getHTML()})
      //   }
      // })

    } else if (this.arg === 'slidetitle') {
      this.vm.editor.setHTML(this.vm.titleText.get('con'))

      this.vm.editor.on('text-change', (delta, source) => {
        if (source === 'user') {
          let data = this.vm.slideData.toJS()
          data[this.vm.slideNum].titleText.con = this.vm.editor.getHTML()
          this.vm.actions.setElement(this.vm.elementid, {data: data})
        }
      })
    } else if (this.arg === 'slidecontent') {
      this.vm.editor.setHTML(this.vm.contentText.get('con'))

      this.vm.editor.on('text-change', (delta, source) => {
        if (source === 'user') {
          let data = this.vm.slideData.toJS()
          data[this.vm.slideNum].contentText.con = this.vm.editor.getHTML()
          this.vm.actions.setElement(this.vm.elementid, {data: data})
        }
      })
    }
  },
  update(nv, ov) {
    // if (this.arg === 'text') {
    //   let element = this.vm.state.getIn(['elements', nv+''])
    //   this.vm.editor.setHTML(element.get('con'))
    // }
  }
})

Vue.directive('events-control', {
  bind() {
    let self = this
    self.vm.$on('PREVIEW_CLICK', msg => {
      self.vm.$broadcast('PREVIEW_CLICK', msg)
    })
    self.vm.$on('BACK_PROLIST', msg => {
      self.vm.$broadcast('BACK_PROLIST', msg)
    })
    self.vm.$on('DELETE_PAGE', msg => {
      self.vm.$broadcast('DELETE_PAGE', msg)
    })
    self.vm.$on('MUSIC_WARN', msg => {
      self.vm.$broadcast('MUSIC_WARN', msg)
    })
    self.vm.$on('IMAGE_WARN', msg => {
      self.vm.$broadcast('IMAGE_WARN', msg)
    })
    self.vm.$on('ANIMATE_SHOW', msg => {
      self.vm.$broadcast('ANIMATE_SHOW', msg)
    })
    self.vm.$on('AUTO_SAVE', msg => {
      self.vm.$broadcast('AUTO_SAVE', msg)
    })
  }
})