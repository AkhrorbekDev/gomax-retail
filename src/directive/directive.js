import Vue from "vue";
import store from "../store/index";

Vue.directive("can", {
  bind(el, binding, vnode) {
    const { value } = binding;
    if (value) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  },
  update(el, binding, vnode) {
    const { value } = binding;
    if (value) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
});
