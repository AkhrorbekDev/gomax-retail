import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./plugins/element.js";
import "./plugins/async-computed";
import "./plugins/vue-clamp";
import "./plugins/customProperties";
import "./directive/directive";
import * as filters from "./utils/filters";
import i18n from "./i18n";

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
