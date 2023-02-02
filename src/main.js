import Vue from 'vue'
import App from './App.vue'
import router from './router'
//  引入Echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 引入tree_gird
import treetable from 'vue-table-with-tree-grid'
// icfont
import '@/assets/fonts/iconfont/iconfont.css'
// element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局样式
import '@/assets/css/global.css'
// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.component('tree-table', treetable);
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
