import moment from 'moment'

export default {
  install (Vue, options) {
    Vue.prototype.$formatTimeYear = function (objects) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].createdTime = moment(objects[i].createdTime).format('YYYY-MM-DD HH:mm')
      }
      return objects
    }
    Vue.prototype.$formatTimeDay = function (objects) {
      for (var i = 0; i < objects.length; i++) {
        // objects[i].createdTime = moment(objects[i].createdTime).startOf('day').fromNow()
        // objects[i].createdTime = moment(objects[i].createdTime).startOf('hour').fromNow()
        let now = moment(new Date())
        let create = moment(objects[i].createdTime)
        let du = moment.duration(now - create)
        objects[i].createdTime = du.locale('en').humanize() + ' ago'
      }
      return objects
    }
  }
}
