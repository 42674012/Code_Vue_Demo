import { bindActionCreators } from 'redux'

export default function reduxMixinsCreator(actionCreators) {
  return {
    data () {
      return {
        state: null,
        actions: null
      }
    },

    created () {
      this.unsubsribe = this.store.subscribe(this.updateState.bind(this))
      this.actions = bindActionCreators(actionCreators, this.store.dispatch)
    },

    destroyed () {
      this.unsubscribe()
    },

    methods: {
      updateState () {
        this.state = this.store.getState()['undoWrapper']['present']
        this.pastStates = this.store.getState()['undoWrapper']['past']
        this.futureStates = this.store.getState()['undoWrapper']['future']
      }
    }
  }
}
