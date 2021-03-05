import axios from "axios";
import store from "../store";
import auth from "../utils/auth";
import router from "../router/index";

const service = axios.create({
  // baseURL: "http://192.168.30.102/api/retail",
  baseURL: "https://demo.gomax.uz/api/retail",
  timeout: 40000
});

service.interceptors.request.use(
  config => {
    if (auth.getToken()) {
      config.headers["Authorization"] = `Bearer ${auth.getToken()}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response);
    } else {
      return Promise.resolve(response);
    }
  },
  error => {
    const response = error.response;
    if (response.status === 401) {
      auth.clearStorge();
      router.replace("/login").catch(err => {});
    }
    return Promise.reject(error);
  }
);

export default service;
