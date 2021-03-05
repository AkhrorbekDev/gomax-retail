import { flatMap } from "lodash";

class OrderItem {
  static result;

  // output
  static rawResources(items) {
    this.result = items.map(item => {
      return {
        retail_order_item_id: item.id || null,
        product_id: item.product.id,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        nds: item.nds ? item.nds : 0,
        note: item.note ? item.note : "",
        warehouse_ids: flatMap(item.warehouses, "id")
      };
    });
    return this.result;
  }

  //input
  static reverseResources(items) {
    this.result = items.map(item => this.reverseResource(item));
    return this.result;
  }

  static reverseResource(item) {
    return {
      id: item.id || null,
      product: item.product ? item.product : item,
      price:
        item.product && item.product.price ? item.product.price : item.price,
      quantity: item.quantity ? item.quantity : 1,
      discount: item.discount ? item.discount : 0,
      nds: item.nds ? item.nds : 0,
      note: item.note ? item.note : "",
      warehouses: item.warehouses ? item.warehouses : []
    };
  }
  static reverseProduct(item) {
    return {
      id: null,
      product: item,
      price: item.price,
      quantity: 1,
      discount: 0,
      nds: 0,
      note: "",
      warehouses: item.warehouses
    };
  }
}

export default OrderItem;
