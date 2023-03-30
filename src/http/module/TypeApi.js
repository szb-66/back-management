import { ApiClient, BASE_URL } from '../index';

export default class TypeApi {
  static query() {
    return ApiClient.server().get(BASE_URL + '/types');
  }

  static create(body) {
    return ApiClient.server().post(BASE_URL + `/types`, body);
  }

  static delete(id) {
    return ApiClient.server().delete(BASE_URL + `/types/${id}`);
  }
};
