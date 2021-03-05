export function SET_WAREHOUSES(state, payload) {
  state.warehouses.push(payload);
}

export function CLEAR_WAREHOUSES(state) {
  state.warehouses = [];
}
