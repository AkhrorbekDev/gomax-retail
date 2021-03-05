import request from '../utils/request';

class category {
  static async getAll() {
    return request({
      url: '/categories/inventory',
      method: 'get',
    });
  }

}

export default category;
