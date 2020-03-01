<template>
  <el-row class="main-container">
    <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
      <div class="post-container">
        <h1>{{post.title}}</h1>
        <div class="post-info">
          <span>Author: {{(post.author)}} | </span>
          <span>Time: {{post.createdTime}} | </span>
          <span>Views: {{post.viewCount}} </span>
        </div>
        <el-divider/>
        <div>
          <span class="content">{{post.content}}</span>
        </div>
        <el-divider/>
        <h2>{{post.commentCount}} comments</h2>
        <el-divider class="comment-divider"></el-divider>
        <div class="comment-container">
          <div v-for="comment in comments" v-bind:key="comment._id">
            <el-container>
              <el-aside width="auto">
                <el-image
                  style="width: 80px; height: 80px"
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  fit="fit"></el-image>
              </el-aside>
              <el-main class="comment-body">
                <div style="display: inline">
                  <a class="username" href="www.baidu.com">{{(comment.author)}}</a>
                  <span v-show="($store.state.isUserLogin && comment.creatorId === $store.state.user._id) || isPoster" id="btn-delete" class="el-icon-close" @click="deleteComment(comment._id)"></span>
                </div>
                <p>{{comment.content}}</p>
                <span class="post-info">{{comment.createdTime}}</span>
              </el-main>
            </el-container>
            <el-divider class="comment-divider"/>
          </div>
          <div class="comment-input">
            <el-input type="textarea" :rows="4" placeholder="comment here" v-model="comment"></el-input>
            <el-button id="btn-comment" type="primary" @click="submitComment">comment</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="post-creator">
        <el-container>
          <el-header>
            <h2>Comment Rules</h2>
          </el-header>
          <el-main id="rules">
            <p>1. Don't scold others</p>
            <p>2. Respect the views of others</p>
            <p>3. Don't post pornographic or violent content</p>
          </el-main>
        </el-container>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import PostService from '../../services/PostService'
import CommentService from '../../services/CommentService'

let moment = require('moment')

export default {
  name: 'detail',
  data () {
    return {
      post: '',
      comments: '',
      error: '',
      comment: '',
      time: '',
      isPoster: false
    }
  },
  created () {
    this.loadDetail(this.$route.params.id)
  },
  methods: {
    loadDetail (id) {
      PostService.getPostDetail(id)
        .then(response => {
          var post = response.data.post
          post.createdTime = moment(post.createdTime).format('YYYY-MM-DD HH:mm')
          this.post = post
          var comments = response.data.comments
          for (var i = 0; i < comments.length; i++) {
            comments[i].createdTime = moment(comments[i].createdTime).format('YYYY-MM-DD HH:mm')
          }
          this.comments = comments
          if (this.$store.state.isUserLogin && post.creatorId === this.$store.state.user._id) {
            this.isPoster = true
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    async submitComment () {
      if (!this.$store.state.isUserLogin) {
        this.$message.warning({
          message: 'Please login',
          center: true
        })
      } else {
        try {
          const response = await CommentService.comment({
            parentId: this.post._id,
            content: this.comment,
            creatorId: this.$store.state.user._id
          })
          if (response.data.code === 0) {
            this.error = response.data.msg
          } else {
            this.$message.success({
              message: 'Comment successfully',
              center: true
            })
            this.comment = ''
            this.loadDetail(this.$route.params.id)
          }
        } catch (e) {
          this.$message.warning({
            message: 'Failed to Comment. Please retry later',
            center: true
          })
        }
      }
    },
    async deleteComment (id) {
      this.$confirm('Are you sure to delete this comment?', 'Delete', {
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
        type: 'warning'
      }).then(async () => {
        CommentService.delete(id)
          .then(response => {
            let code = response.code
            if (code === 0) {
              this.$message({
                type: 'error',
                message: 'Cancelled'
              })
            } else {
              this.$message({
                type: 'success',
                message: 'You successfully deleted this comment!'
              })
              this.loadDetail(this.$route.params.id)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancelled'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .main-container {
    background: white;
  }

  .post-container {
    padding-left: 40px;
    background: white;
  }

  .post-creator {
    background: white;
    height: 100%;
  }

  .post-info {
    color: gray;
  }

  .content {
    margin-left: 20px;
  }

  h1 {
    font-weight: normal;
  }

  h2 {
    font-weight: normal;
    margin-bottom: 0px;
  }

  .comment-container {
    margin-left: 10px;
  }

  .comment-body {
    margin-left: 10px;
    padding: 0px;
  }

  .comment-divider {
    margin: 10px 0px;
  }

  .comment-input {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  #btn-comment {
    margin-left: 10px;
  }

  p {
    margin: 13px 0px;
  }

  #rules {
    padding-top: 0px;
  }

  #btn-delete {
    cursor: pointer;
    position: relative;
    margin-left: 90%;
  }
</style>
