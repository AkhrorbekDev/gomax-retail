import auth from "../../../utils/auth";

export async function login({ commit }, payload) {
  await auth.setToken(payload.token, payload.token_type);
  await auth.setName(payload.name);
  await auth.setShop(payload.shop.id);
  commit("SET_DATA", payload);
}

export function savePermissions({ commit }, payload) {
  commit("SAVE_PERMISSIONS", payload);
}

export function saveClient({ commit }, payload) {
  commit("SAVE_CLIENT", payload);
}
