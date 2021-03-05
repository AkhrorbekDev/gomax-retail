import request from "../../utils/request";

const auth = {
  login: data => {
    return request({
      url: "/auth/login",
      method: "post",
      data
    });
  },
  logout: () => {
    return request({
      url: "/auth/logout",
      method: "post"
    });
  },
  auth: () => {
    return request({
      url: "/auth/user",
      method: "get"
    });
  }
};

export default auth;
