// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import routes from "./routes/routes.js";

Vue.config.productionTip = false;

// import echarts from "./js/echarts"
// require('./js/jquery.js');
// require('./js/public.js');



var router = new VueRouter(
  {
    routes
  }
);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  component: { App },
  render: (h) => h(App)
})
