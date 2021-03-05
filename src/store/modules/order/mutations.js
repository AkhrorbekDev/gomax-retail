import { filter, find } from "lodash";

export function CREATE_ORDER(state, payload) {
  state.order = payload;
}

export function SAVE_COUNT(state, payload) {
  state.orderCount = payload;
}

export function SET_CLIENT_ID(state, payload) {
  state.order.retail_client_id = payload.id;
  state.client = payload;
}

export function CLEAR(state) {
  state.order = {};
}
