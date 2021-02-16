import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false
  },
  mutations: {
    setLoggedIn(state, val) {
      if (typeof val == 'boolean')
        state.isLoggedIn = val
    }
  },
  actions: {
  },
  modules: {
  }
})
