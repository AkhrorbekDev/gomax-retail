import { last, find, sumBy } from "lodash";

export function ADD_PRODUCT(state, item) {
  const product = find(state.products, ["product.id", item.product.id]);
  if (!product) {
    state.products.push({
      ...item
    });
    ACTIVE_ITEM(state, item.product.id);
  } else {
    const totalRemainderAll = sumBy(product.warehouses, "total_remainder");
    if (product.quantity < totalRemainderAll) {
      product.quantity += 1;
    }
    ACTIVE_ITEM(state, product.product.id);
  }
}

export function REMOVE_PRODUCT(state, index) {
  state.products.splice(index, 1);
  const item = last(state.products);
  if (item) {
    ACTIVE_ITEM(state, item.product.id);
  }
}

export function CLEAR_PRODUCTS(state) {
  state.products = [];
}

export function CHANGE_DISCOUNT(state, payload) {
  const item = find(state.products, ["product.id", payload.id]);
  item.discount = payload.discount;
  ACTIVE_ITEM(state, payload.id);
}

export function CHANGE_NOTE(state, payload) {
  const item = find(state.products, ["product.id", payload.id]);
  item.note = payload.note;
  ACTIVE_ITEM(state, payload.id);
}

export function CHANGE_QUANTITY(state, payload) {
  const item = find(state.products, ["product.id", payload.id]);
  item.quantity = payload.quantity;
  ACTIVE_ITEM(state, payload.id);
}

export function CHANGE_WAREHOUSE(state, payload) {
  const item = find(state.products, ["product.id", payload.id]);
  item.warehouses = payload.warehouses;
  ACTIVE_ITEM(state, payload.id);
}

export function DECREMENT(state, id) {
  const item = find(state.products, ["product.id", id]);
  item.quantity -= 1;
  ACTIVE_ITEM(state, payload.id);
}

export function INCREMENT(state, id) {
  const item = find(state.products, ["product.id", id]);
  item.quantity += 1;
  ACTIVE_ITEM(state, payload.id);
}

export function SAVE_CURRENCY(state, payload) {
  state.currency = payload;
}

export function ACTIVE_ITEM(state, id) {
  state.activeItem = id;
}
