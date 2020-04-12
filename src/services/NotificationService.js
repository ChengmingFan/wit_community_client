import Api from '../services/index'

export default {
  getUnreadNum (id) {
    return Api().get(`/notification/num/${id}`)
  },
  getNotifications (id) {
    return Api().get(`/notification/${id}`)
  },
  markRead (id) {
    return Api().get(`/notification/mark/${id}`)
  }
}
