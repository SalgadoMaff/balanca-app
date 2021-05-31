import Vue from 'vue';
import Vuex from 'vuex';

import error from '@/store/error';
import user from '@/store/user';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    error,
    user,
  },
})
