import Api from '../services/index'
import store from '../store'

export default {
  comment (data) {
    return Api().post('/comment', data,
      { headers: { 'Authorization': 'Bearer ' + store.state.token } })
  },
  delete (id) {
    return Api().delete(`/comment/delete/${id}`,
      { headers: { 'Authorization': 'Bearer ' + store.state.token } })
  },
  getComments (id) {
    return Api().get(`/comments/${id}`)
  },
  likeComment (data) {
    return Api().post(`/comment/like/`, data)
  },
  getRepliedUser (id) {
    return Api().get(`/comment/getParentCommentDetail/${id}`)
  }
}
