import { find } from 'lodash';

export function getWarehouses(state) {
  return (product_id) => find(state.warehouses, ['product_id', product_id]);
}
