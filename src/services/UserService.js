import Api from '../services/index'
import store from '../store'

export default {
  register (data) {
    return Api().post('/user/register', data,
      { headers: { 'Content-type': 'application/json' } })
  },
  login (data) {
    return Api().post('/user/login', data,
      { headers: { 'Content-type': 'application/json' } })
  },
  update (data) {
    return Api().put('/user/update', data,
      { headers: { 'Authorization': 'Bearer ' + store.state.token } })
  },
  getUserById (id) {
    return Api().get(`/user/${id}`)
  },
  getPostsByUserID (id) {
    return Api().get(`/post/user/${id}`)
  },
  getCommentsByUserId (id) {
    return Api().get(`/comment/user/${id}`)
  },
  getUserByGid (data) {
    return Api().post(`/user/gid/`, data)
  }
}
