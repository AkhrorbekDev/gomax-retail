import Vue from "vue";
import VueRouter from "vue-router";
import auth from "../utils/auth";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history" // hash
});

router.beforeEach((to, from, next) => {
  const hasToken = auth.getToken();

  if (to.matched.some(route => route.meta.protected)) {
    if (hasToken) {
      next();
    } else {
      router.replace("/login").catch(err => {});
    }
  }
  if (to.fullPath === "/login") {
    if (hasToken) {
      router.replace("/home");
    }
    next();
  }
  next();
});

export default router;
