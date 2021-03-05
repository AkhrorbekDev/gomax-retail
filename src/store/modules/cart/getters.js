import { find, matchesProperty } from "lodash";

export function getProducts(state) {
  return state.products;
}

export function getQuantity(state) {
  return id => find(state.products, ["product.id", id]).quantity;
}

export function getProduct(state) {
  return id => state.products.some(matchesProperty("product.id", id));
}

export function hasProducts(state) {
  return !!state.products.length;
}

export function getProductWarehouses(state) {
  return product_id => find(state.products, ["product.id", product_id]).product;
}

export function hasEmptyWarehouse(state) {
  return state.products.map(({ warehouses }) => warehouses.length === 0)[0];
}

export function getProductDiscount(state) {
  return product_id =>
    find(state.products, ["product.id", product_id]).discount;
}

export function getActiveItem(state) {
  return state.activeItem;
}

export function getCurrency(state) {
  return state.currency;
}
