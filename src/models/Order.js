import auth from "../utils/auth";

class Order {
  static reverseResource(order) {
    return {
      retail_order_id: order.id ? order.id : null,
      is_with_nds: order.is_with_nds ? order.is_with_nds : false,
      shop_id: order.shop ? order.shop.id : auth.getShop(),
      retail_client_id: order.retail_client
        ? order.retail_client.id
        : auth.getClientId()
    };
  }

  static newOrder() {
    return {
      retail_order_id: null,
      is_with_nds: false,
      shop_id: auth.getShop(),
      retail_client_id: auth.getClientId()
    };
  }
}

export default Order;
