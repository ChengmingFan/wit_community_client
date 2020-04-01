<template>
  <section style="margin-top: -20px;" >
    <el-container style="height: 500px">
      <div class="comment-container">
        <el-scrollbar style="width:100%;height: 100%">
          <div v-for="comment in comments" v-bind:key="comment._id" style="float: left;width: 100%;" >
            <div style="width: 100%;">
              <el-avatar
                style="vertical-align: bottom;float: left"
                shape="square"
                :size=30
                :src="comment.author.avatarUrl"
                fit="fit"></el-avatar>
              <a class="username" @click="$router.push('/user/profile/' + comment.creatorId)">{{(comment.author.username)}}</a>
              <span style="float: right">{{comment.createdTime}}</span>
            </div>
            <div class="comment-body">
              <p style="float: left;margin-left: 37px">{{comment.content}}</p>
              <!--              <div>-->
              <!--                <span class="icons"><img src="../../static/img/like.png"/>{{comment.likeCount}}</span>-->
              <!--                <span class="icons" @click="showComments(comment._id)"><img src="../../static/img/comment.png"/>{{comment.commentCount}}</span>-->
              <!--                &lt;!&ndash;                  <span><img class="icons" src="../../static/img/liked.png"/></span>&ndash;&gt;-->
              <!--                <span class="post-info" id="comment-time">{{comment.createdTime}}</span>-->
              <!--              </div>-->
              <el-divider class="comment-divider"/>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-input placeholder="comment here" v-model="commentContent"/>
      <el-button type="primary" style="margin-left: 3px" @click="submitComments">comment</el-button>
    </div>
  </section>
</template>

<script>
import CommentService from '../services/CommentService'
export default {
  name: 'ShowComments',
  data () {
    return {
      commentContent: '',
      comments: ''
    }
  },
  created () {
    this.getComments(this.commentId)
  },
  methods: {
    getComments (id) {
      CommentService.getComments(id)
        .then(response => {
          this.comments = this.$formatTimeDay(response.data.comments)
        })
    },
    async submitComments () {
      if (!this.$store.state.isUserLogin) {
        this.$message.warning({
          message: 'Please login',
          center: true
        })
      } else {
        try {
          const response = await CommentService.comment({
            type: 1,
            parentId: this.commentId,
            content: this.commentContent,
            creatorId: this.$store.state.user._id
          })
          if (response.data.code === 0) {
            this.error = response.data.msg
          } else {
            this.$message.success({
              message: 'Comment successfully',
              center: true
            })
            this.commentContent = ''
          }
        } catch (e) {
          console.log(e)
          this.$message.warning({
            message: 'Failed to Comment. Please retry later',
            center: true
          })
        }
      }
    }
  },
  props: {
    commentId: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__body{
    height: 462px;
  }
  .dialog-footer{
    display: flex;
    margin-bottom: -20px;
  }
  .username{
    font-size: 20px;
    float: left;
    margin-left: 5px;
  }
  .comment-container{
    width: 100%;
    height: 500px;
  }
  .comment-body{
    margin-top: 30px;
  }
  .comment-divider{
    float: left;
  }
</style>
