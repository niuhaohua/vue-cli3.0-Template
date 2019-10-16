import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/base.scss";
import './components/Icons/index' // icon
import './router/routerManage' //路由控制
import api from './api/api' //api封装
import * as filters from './utils/filter' // 过滤器

const Bus = new Vue()

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$api = api;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
