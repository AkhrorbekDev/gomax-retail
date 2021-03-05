import auth from "../../../utils/auth";
import { includes, map, filter } from "lodash";

export function hasToken(state) {
  return !!auth.getToken();
}

export function getPermissions(state) {
  return state.permissions;
}
export function hasRole(state) {
  return slug => includes(map(state.permissions, "slug"), slug);
}
