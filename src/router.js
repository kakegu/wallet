import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Home from './views/Home.vue'
import Create from './views/Create.vue'
import Import from './views/Import.vue'
import Wallet from './views/Wallet.vue'
import Payment from './views/Payment.vue'
import History from './views/History.vue'
import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint); 
Vue.use(BootstrapVue);
Vue.use(Router)
Vue.use(VueResource)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/import',
      name: 'import',
      component: Import
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
