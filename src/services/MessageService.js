import Api from '../services/index'

export default {
  createMessage (data) {
    return Api().post('/message/create', data)
  },
  getMessage (data) {
    return Api().post(`/message/get`, data)
  },
  getUnreadNum (id) {
    return Api().get(`/message/num/${id}`)
  },
  getMessengerList (id) {
    return Api().get(`/message/messenger/${id}`)
  },
  markRead (data) {
    return Api().post(`/message/read/`, data)
  }
}
