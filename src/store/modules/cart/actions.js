export async function add({ commit }, payload) {
  commit("ADD_PRODUCT", payload);
}

export function remove({ commit }, payload) {
  commit("REMOVE_PRODUCT", payload);
}

export function clear({ commit }) {
  commit("CLEAR_PRODUCTS");
}
export function filter({ commit }) {
  commit("FILTER_PRODUCTS");
}
export function changeWarehouse({ commit }, payload) {
  commit("CHANGE_WAREHOUSE", payload);
}

export function changeDiscount({ commit }, payload) {
  commit("CHANGE_DISCOUNT", payload);
}

export function changeNote({ commit }, payload) {
  commit("CHANGE_NOTE", payload);
}

export function decrement({ commit }, payload) {
  commit("DECREMENT", payload);
}

export function changeQuantity({ commit }, payload) {
  commit("CHANGE_QUANTITY", payload);
}

export function increment({ commit }, payload) {
  commit("INCREMENT", payload);
}

export function setActiveItem({ commit }, id) {
  commit("ACTIVE_ITEM", id);
}

export function saveCurrency({ commit }, payload) {
  commit("SAVE_CURRENCY", payload);
}
