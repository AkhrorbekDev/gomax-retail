export function SET_DATA(state, payload) {
  state.name = payload.name;
  state.token = payload.token;
  state.token_type = payload.token_type;
  state.role = payload.role;
  state.expires_at = payload.expires_at;
  state.shop = payload.shop;
}

export function LOG_OUT(state) {
  state.token = "";
  state.name = "";
}

export function SAVE_PERMISSIONS(state, permissions) {
  state.permissions = permissions;
}

