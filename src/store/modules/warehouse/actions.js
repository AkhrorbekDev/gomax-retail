export async function add({ commit }, payload) {
  commit('SET_WAREHOUSES', payload);
}

export async function clear({ commit }) {
  commit('CLEAR_WAREHOUSES');
}
