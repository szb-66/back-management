import { ApiClient, BASE_URL } from '../index';

export default class ArticleApi {
  static query() {
    return ApiClient.server().get(BASE_URL + '/articles');
  }

  static create(body) {
    return ApiClient.server().post(BASE_URL + `/articles`, body);
  }

  static update(id, body) {
    return ApiClient.server().put(BASE_URL + `/articles/${id}`, body);
  }

  static delete(id) {
    return ApiClient.server().delete(BASE_URL + `/articles/${id}`);
  }
}
