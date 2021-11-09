import Vuex from "vuex";

// importar axios

import VueAxios from "vue-axios";
import axios from "axios";

// importar y configurar vue-router

import VueRouter from "vue-router";
import { routes } from "./routes";
import StoreData from "./store";
import { initialize } from "./helpers/general";

import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

window.Vue = Vue;

import App from "./components/App.vue";

const store = new Vuex.Store(StoreData);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

const router = new VueRouter({
  mode: "history",
  routes: routes,
});

initialize(store, router, axios);

new Vue({
  router: router,
  store,
  render: (h) => h(App),
}).$mount("#app");
