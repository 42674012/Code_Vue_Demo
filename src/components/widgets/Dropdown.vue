<template>
  <div>
    <slot></slot>
    <slot name="dropdown-menu"></slot>
  </div>
</template>
<script>
  import EventListener from '../../helpers/events'
  export default {
    methods: {
      toggleDropdown(e) {
        e.preventDefault()
        // e.stopPropagation()
        this.$el.classList.toggle('open')
      },
    },
    ready() {
      const el = this.$el
      const toggle = el.querySelector('[data-toggle="dropdown"]')
      if (toggle)
      {
        // toggle.style.borderRadius = '4px'
        toggle.addEventListener('click', this.toggleDropdown)
      }

      this._closeEvent = EventListener.listen(window, 'click', (e)=> {
        if (!el.contains(e.target) || e.target.tagName === 'A') el.classList.remove('open')
        // el.classList.remove('open')
      })
    },
    beforeDestroy() {
      if (this._closeEvent) this._closeEvent.remove()
    }
  }
</script>
