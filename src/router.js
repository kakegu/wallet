import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Home from './views/Home.vue'
import Create from './views/Create.vue'
import Import from './views/Import.vue'
import Wallet from './views/Wallet.vue'
import Payment from './views/Payment.vue'
import History from './views/History.vue'
import Set from './views/Set.vue'
import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import Mint from 'mint-ui';
// import 'mint-ui/lib/style.css';
// Vue.use(Mint); 
Vue.use(Router)
Vue.use(VueResource)
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
Vue.http.options.timeout = 3000;
export default new Router({
  //mode: 'history',
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
      path: '/setting',
      name: 'set',
      component: Set
    }
  ]
})
