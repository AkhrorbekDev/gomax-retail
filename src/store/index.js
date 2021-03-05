import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import state from "./state";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: state,
  modules: modules,
  strict: true
});

export default store;
