// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueFire from 'vuefire'
import 'element-ui/lib/theme-default/index.css'
import './service/firebase'

// vue-awesome icons
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/star-o'
import 'vue-awesome/icons/heart'
import 'vue-awesome/icons/heart-o'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/minus'
import 'vue-awesome/icons/arrows-alt'
import 'vue-awesome/icons/link'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/map-o'
import Icon from 'vue-awesome/components/Icon'

Vue.use(ElementUI)
Vue.use(VueFire)
Vue.config.productionTip = false
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
