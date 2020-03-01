import Api from '../services/index'
import store from '../store'

export default {
  getAllPost () {
    return Api().get('/all')
  },
  getPostDetail (id) {
    return Api().get(`/post/${id}`)
  },
  createPost (data) {
    return Api().post('/post', data,
      { headers: { 'Authorization': 'Bearer ' + store.state.token } })
  },
  searchPost (keywords) {
    return Api().get(`/search/${keywords}`)
  },
  getSubareaPost (subarea) {
    return Api().get(`/subarea/${subarea}`)
  },
  getPopular () {
    return Api().get('/popular')
  }
}
