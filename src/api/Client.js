import request from "../utils/request";
import auth from "../utils/auth";
import store from "../store/index";

class Client {
  static role;
  static prefix = "retailClients.";
  static async getClient(query) {
    const shop_id = auth.getShop();

    if (query) {
      return await request.get("/retailClients/inventory", {
        params: {
          ...query,
          shop_id
        }
      });
    } else {
      return await request.get("/retailClients/inventory", {
        params: {
          ...query,
          shop_id
        }
      });
    }
  }

  static async createClient(data) {
    try {
      this.role = this.prefix + "create";
      const hasRole = store.getters["auth/hasRole"](this.role);
      if (hasRole) {
        return await request.post("/retailClients", data);
      } else {
        return Promise.reject({
          status: false,
          message: "У вас нет прав добавить новый клиент."
        });
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default Client;
