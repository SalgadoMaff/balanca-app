import api from '@/api/config';

export default {
  login(username, password) {
    return api.post('users/login', { username, password })
    },
  findUser() {
    return api.get('users/session');
  },
}
