import request from '../utils/request';

class Warehouse {
  static async getWarehouses(data) {
    return await request.get('/warehouses/get/withProductRemainder', { params: data });
  }
}

export default Warehouse;
