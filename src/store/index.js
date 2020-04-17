import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    user: null,
    isUserLogin: false,
    messageDialogVisible: false,
    receiver: null,
    currentSubarea: null
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
    setReceiver (state, receiver) {
      state.receiver = receiver
    },
    setCurrentSubarea (state, currentSubarea) {
      state.currentSubarea = currentSubarea
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
    setReceiver ({ commit }, receiver) {
      commit('setReceiver', receiver)
    },
    setCurrentSubarea ({ commit }, currentSubarea) {
      commit('setCurrentSubarea', currentSubarea)
    }
  }
})
export default store
