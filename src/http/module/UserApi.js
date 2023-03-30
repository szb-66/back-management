import { ApiClient, BASE_URL } from '../index';

export default class UserApi {
  static login(body) {
    return ApiClient.server().post(BASE_URL + '/login', body);
  }
}
