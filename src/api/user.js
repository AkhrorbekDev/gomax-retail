import axios from "../utils/request";

const user = {
  getUsers: async () => {
    return await axios
      .get("/users/inventory")
      .then(res => {
        return res.data.result;
      })
      .catch(err => {
        return false;
      });
  }
};

export default user;
