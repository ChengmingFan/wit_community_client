<template>
  <section style="margin-top: -20px;" >
    <el-container style="height: 500px">
      <div class="comment-container">
        <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
          <div v-for="(comment,index) in comments" v-bind:key="comment._id" style="float: left;width: 100%;" @mouseover="showReply(index)" @mouseleave="hideReply(index)">
            <div style="width: 100%;height: 30px">
              <el-avatar v-if="comment.author.avatarUrl" class="avatar" shape="square" :size=30 :src="comment.author.avatarUrl" fit="fit"></el-avatar>
              <el-avatar v-else class="avatar" shape="square" :size=30 :src="comment.author.avatarUrl" fit="fit">{{comment.author.username}}</el-avatar>
              <div style="height: 100%;width: 98%;">
                <a class="username" @click="$router.push('/user/profile/' + comment.creatorId)">{{(comment.author.username)}}</a>
                <span style="margin-left: 8px;margin-bottom: 5px;display:inline-block" v-if="comment.ref">reply</span>
                <a v-if="comment.ref" style="float: none;margin-left: 8px" class="username" @click="$router.push('/user/profile/' + comment.ref._id)">{{comment.ref.username}}</a>
                <span style="float: right;margin-right: 10px">{{comment.createdTime}}</span>
              </div>
            </div>
            <div class="comment-body">
              <p id="content" style="color: black">{{comment.content}}</p><br/>
              <span style="display:none">{{flag}}</span>
              <div style="margin-top: 15px;margin-left: 38px">
                <span class="icons" @click="likeComment(comment._id,1,index)" v-if="likedComments.indexOf(comment._id) < 0"><img src="../static/img/like.png"/>{{comment.likeCount}}</span>
                <span class="icons" @click="likeComment(comment._id,-1,index)" v-if="likedComments.indexOf(comment._id) >= 0"><img src="../static/img/liked.png"/>{{comment.likeCount}}</span>
                <!--                  <span><img class="icons" src="../../static/img/liked.png"/></span>-->
                <span class="icons" v-if="!showArray[index]&&isShowReply[index]" @click="showInputArea(index)"><img class="reply" src="../static/img/reply3.png">reply</span>
                <span class="icons" v-if="showArray[index]" @click="hideInputArea(index)"><img class="reply" src="../static/img/reply3.png">cancel reply</span>
<!--                <span class="icons" v-if="showArray[index]" @click="hideInputArea(index)"><i class="el-icon-position">cancel reply</i></span>-->
              </div>
              <div class="replyArea" v-if="showArray[index]">
                <el-input v-bind:placeholder="'reply ' + comment.author.username" v-model="commentContent2"/>
                <el-button type="primary" style="margin-left: 3px" @click="replyComments(comment.author,index)">reply</el-button>
              </div>
              <el-divider class="comment-divider"/>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-input placeholder="write your comment here" v-model="commentContent"/>
      <el-button type="primary" style="margin-left: 3px" @click="submitComments()">comment</el-button>
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
      comments: '',
      showArray: [],
      flag: false,
      commentContent2: '',
      isShowReply: [],
      likedComments: []
    }
  },
  created () {
    this.getComments(this.commentId)
    if (this.$store.state.isUserLogin) {
      this.likedComments = this.$store.state.user.likedComments
    }
  },
  methods: {
    async getComments (id) {
      CommentService.getComments(id)
        .then(response => {
          this.comments = this.$formatTimeDay(response.data.comments)
        })
    },
    async refreshComments () {
      CommentService.getComments(this.commentId)
        .then(response => {
          this.comments = this.$formatTimeDay(response.data.comments)
          this.$nextTick(() => {
            this.scrollDown()
          })
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
            this.refreshComments()
          }
        } catch (e) {
          console.log(e)
          this.$message.warning({
            message: 'Failed to Comment. Please retry later',
            center: true
          })
        }
      }
    },
    async replyComments (user, index) {
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
            content: this.commentContent2,
            creatorId: this.$store.state.user._id,
            ref: user
          })
          if (response.data.code === 0) {
            this.error = response.data.msg
          } else {
            this.$message.success({
              message: 'Comment successfully',
              center: true
            })
            this.commentContent2 = ''
            this.showArray[index] = false
            this.refreshComments()
          }
        } catch (e) {
          console.log(e)
          this.$message.warning({
            message: 'Failed to Comment. Please retry later',
            center: true
          })
        }
      }
    },
    async scrollDown () {
      this.$refs['myScrollbar'].$refs['wrap'].scrollTop = this.$refs['myScrollbar'].$refs['wrap'].scrollHeight
    },
    showInputArea (index) {
      this.showArray[index] = true
      this.flag = !this.flag
    },
    hideInputArea (index) {
      this.showArray[index] = false
      this.flag = !this.flag
    },
    showReply (index) {
      this.isShowReply[index] = true
      this.flag = !this.flag
    },
    hideReply (index) {
      this.isShowReply[index] = false
      this.flag = !this.flag
    },
    async likeComment (id, type, index) {
      await this.$likeComment(id, type, index)
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
    /*margin-top: 30px;*/
  }
  .comment-divider{
    float: left;
  }
  .icons {
    vertical-align: middle;
    color: gray;
    display:inline-block;
    padding-right: 10px;
    cursor: pointer;
    img {
      width: 18px;
      height: 20px;
      margin-right: 5px;
      vertical-align: middle;
      margin-top: -3px;
    }
    .reply {
      width: 20px;
      height: 18px;
    }
  }
  #content {
    float: left;
    margin-left: 37px;
    margin-top: 8px;
    margin-bottom: 0;
  }
  .replyArea {
    display: flex;
    .el-input{
      margin-left: 32px;
      width: 93%;
    }
    .el-button {
      margin-right: 10px;
    }
  }
  .avatar {
    vertical-align: bottom;
    float: left;
  }
</style>
