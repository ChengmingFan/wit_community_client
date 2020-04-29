import moment from 'moment'
import CommentService from '../services/CommentService'

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
        let now = moment(new Date())
        let create = moment(objects[i].createdTime)
        let du = moment.duration(now - create)
        objects[i].createdTime = du.locale('en').humanize() + ' ago'
      }
      return objects
    }
    Vue.prototype.$formatTimeClock = function (objects) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].createdTime = moment(objects[i].createdTime).format('MMMM Do YYYY, h:mm:ss a')
      }
      return objects
    }
    Vue.prototype.$likeComment = async function (comment, type, index) {
      if (!this.$store.state.isUserLogin) {
        this.$message.warning({
          message: 'Please login',
          center: true
        })
      } else {
        CommentService.likeComment({
          postId: comment.ref === null ? comment.parentId : comment.ref,
          commentId: comment._id,
          receiverId: comment.creatorId,
          content: comment.content,
          userId: this.$store.state.user._id,
          type: type
        }).then(response => {
          if (response.data.code === 0) {
            this.$message({
              type: 'error',
              message: 'There are something wrong.Please try later.'
            })
          } else {
            this.$store.state.user.likedComments = response.data.likedComments
            this.likedComments = response.data.likedComments
            this.comments[index].likeCount = this.comments[index].likeCount + type
          }
        })
      }
    }
  }
}
