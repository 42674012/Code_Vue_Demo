import 'babel-core/polyfill'
import Vue from 'vue'

// vendors
import './vendors/jquery.nicescroll.js'
import './vendors/jquery.event.move.js'
import './vendors/contextmenu/jquery.contextMenu'
import './vendors/contextmenu/jquery.contextMenu.css'
import './vendors/sweetalert/sweetalert.min.js'
import './vendors/sweetalert/sweetalert.css'
import './vendors/jstree/jstree.min'
import './vendors/jstree/style.min.css'

import './filters.js'
import './directives.js'
import App from './components/App.vue'

Vue.config.debug = process.env.NODE_ENV === 'development' ? true : false
new Vue(App)
