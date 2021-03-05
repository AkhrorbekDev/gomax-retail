import request from '../utils/request';

class product {
  static async getProducts() {
    return await request.get('/products/inventory');
  };

  static async getProductByCategoryId(data = {}) {
    return await request.get('/products/inventory', { params: data });
  };

  static async getProductByCode(data) {
    return await request.get('/products/get/byProductCode', { params: data });
  }
}

export default product;
