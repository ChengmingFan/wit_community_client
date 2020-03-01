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
  }
}
