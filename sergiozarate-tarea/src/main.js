import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import salesList from './salesList.vue'
import productsSales from './products.vue'
import graphProducts from './graphProducts'
import otherStatistics from './otherStatistics'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons);

Vue.use(VueRouter);

// Establecemos as rutas de la página web

const routes = [
  {path: '/productsSales', component: productsSales, children: [
    {
      path: 'graphProducts/:data/:options', 
      name: 'graphProducts', 
      component: graphProducts
    }
  ]},
  {path: '/salesList', component: salesList},
  {path: '/statistics', component: otherStatistics}
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.component('salesList', salesList);
Vue.component('productsSales', productsSales);
Vue.component('otherStatistics', otherStatistics);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
