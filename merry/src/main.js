import Vue from 'vue';
import Router from 'vue-router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLocalStorage from 'vue-localstorage'
import App from './App';

Vue.config.productionTip = false;


Vue.use(Router);
Vue.use(Antd);
Vue.use(VueAxios, axios);
Vue.use(VueLocalStorage);

const routes = [
  { path: '/login', component: () => import("./components/Login.vue") },
  { path: '/wish', component: () => import("./components/Wish.vue") },
  { path: '/ticket', component: () => import("./components/Ticket.vue") },
]

const router = new Router({
    routes,
})

Vue.mixin({
    data() {
        return {
            currentUser: null,
        };
    },
    methods: {
        loadCurrentUser() {
          this.$http.get(`/api/whoami`)
          .then(response => {
            this.currentUser = response.data;
          })
          .catch(e => {
            this.currentUser = null;
            console.log(e);
          })
          .finally(() => {
            this.$localStorage.set('currentUser', this.currentUser);
            if (!(this.$route.path === '/')){
              if (!this.currentUser){
                this.$router.push({ path: '/login' });
              }
            }
          });
        },
    },
    created() {
        this.loadCurrentUser();
    },
})

new Vue({
  router,
  localStorage: {
    currentUser: {type: Object, default: null},
  },
  render: h => h(App)
}).$mount('#app');
