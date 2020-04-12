import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    user: null,
    isUserLogin: false,
    messageDialogVisible: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (token) {
        state.isUserLogin = true
      } else {
        state.isUserLogin = false
      }
    },
    setUser (state, user) {
      state.user = user
    },
    setMessageDialogVisible (state, flag) {
      state.messageDialogVisible = flag
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setLoadingInstance ({ commit }, loadingInstance) {
      commit('setLoadingInstance', loadingInstance)
    },
    setMessageDialogVisible ({ commit }, flag) {
      commit('setMessageDialogVisible', flag)
    }
  }
})
export default store
