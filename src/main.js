import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/fonts/iconfont.css'
import 'cytoscape-navigator/cytoscape.js-navigator.css'
import 'dragula/dist/dragula.min.css'

import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import formCreate from '@form-create/ant-design-vue'
import './icons/index'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(formCreate)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
