import request from '../utils/request';
import auth from '../utils/auth';
import store from '../store/index';

class Order {
  static params;
  static role;
  static prefix = 'retailOrders.';

  static async createOrder(order) {
    try {

      if (order.retail_order_id === null) {
        this.role = this.prefix + 'create';
      } else {
        this.role = this.prefix + 'update';
      }
      const hasRole = store.getters['auth/hasRole'](this.role);
      if (hasRole) {
        return request.post('/retailOrders', order);
      } else {
        return Promise.reject({
          status: false,
          message:
            this.role === 'retailOrders.create'
              ? 'У вас нет прав сохранит заявок.'
              : 'У вас нет прав перезаписать заявок.',
        });
      }
    } catch (err) {
      return err;
    }
  }

  static async createOrderWithTransaction(order) {
    try {
      this.role = this.prefix + 'createTransaction';
      const hasRole = store.getters['auth/hasRole'](this.role);
      if (hasRole) {
        return request.post('/retailOrders/createWithTransaction', order);
      } else {
        return Promise.reject({
          status: false,
          message: 'У вас нет прав сохранит заявок с оплатой.',
        });
      }
    } catch (err) {
      return err;
    }
  }

  static async getOrders(id) {
    if (id) {
      this.params = {
        shop_id: auth.getShop(),
        id: id,
      };
    } else {
      this.params = {
        shop_id: auth.getShop(),
      };
    }

    return request.get('/retailOrders/get/waitingRetailOrders', {
      params: this.params,
    });
  }

  static async getOrdersQuantity() {
    const query = {
      shop_id: auth.getShop(),
    };
    return request.get('/retailOrders/get/countWaitingRetailOrders', {
      params: query,
    });
  }

  static async getCashBox(data, created = false) {
    if (created) {
      return request.get('/retailOrders/printReceiptAfterCreate', {
        params: data,
      });
    } else {
      return request.post('/retailOrders/printReceiptBeforeCreate', data);
    }
  }

  static async getOrderItems(order_id) {
    return request.get(`/retailOrders/${order_id}`);
  }

  static async deleteOrderItem(id) {
    try {
      this.role = this.prefix + 'deleteItem';
      const hasRole = store.getters['auth/hasRole'](this.role);
      if (hasRole) {
        const data = {
          retail_order_item_id: id,
        };
        return request.post('retailOrders/deleteRetailOrderItem', data);
      } else {
        return Promise.reject({
          status: false,
          message: 'У вас нет прав удалить предметы заявок.',
        });
      }
    } catch (err) {
      return err;
    }
  }
}

export default Order;
