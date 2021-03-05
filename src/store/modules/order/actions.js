import OrderApi from "../../../api/Order";

export async function create({ commit }, payload) {
  commit("CREATE_ORDER", payload);
}

export async function getCount({ commit }) {
  const quantity = (await OrderApi.getOrdersQuantity()).data.result.data
    .countRetailOrders;
  commit("SAVE_COUNT", quantity);
}

export function removeItem({ commit }, payload) {
  commit("REMOVE_ORDER_ITEM", payload);
}

export function setClientID({ commit }, id) {
  commit("SET_CLIENT_ID", id);
}

export function clear({ commit }) {
  commit("CLEAR");
}
