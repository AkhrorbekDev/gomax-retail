import HomePage from "../views/Home/index";
import LoginPage from "../views/login/index";
import MainLayout from "../layouts/MainLayout";

const routes = [
  {
    path: "/",
    redirect: {
      name: "home"
    }
  },
  {
    path: "/home",
    name: "home",
    meta: {
      protected: true,
      layout: MainLayout
    },
    component: HomePage
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: MainLayout
    },
    component: LoginPage
  }
];

export default routes;
