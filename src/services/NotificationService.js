import Api from '../services/index'

export default {
  getUnreadNum (id) {
    return Api().get(`/notification/num/${id}`)
  },
  getNotifications (id) {
    return Api().get(`/notification/${id}`)
  },
  markAllRead (id) {
    return Api().get(`/notification/markAll/${id}`)
  },
  markOneRead (id) {
    return Api().get(`/notification/mark/${id}`)
  }
}
