<template>
  <el-row class="main-container">
    <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
      <div class="post-container">
        <h1>{{post.title}}</h1>
        <div class="post-info">
          <span>Author: {{post.author.username}} | </span>
          <span>Time: {{post.createdTime}} | </span>
          <span>Views: {{post.viewCount}} | </span>
          <span style="color: #409EFF;cursor: pointer" @click="focusComment">Comment</span>
          <span v-if="post.author._id ===  $store.state.user._id" style="color: #409EFF;cursor: pointer" @click="deletePost"> | Delete</span>
        </div>
        <el-divider/>
        <div>
          <span class="content">{{post.content}}</span>
        </div>
        <el-divider/>
        <h2>{{post.commentCount}} comments</h2>
        <el-divider class="comment-divider"></el-divider>
        <div class="comment-container">
          <div v-for="(comment,index) in comments" v-bind:key="comment._id">
            <el-container>
              <el-aside width="auto">
                <el-avatar v-if="comment.author.avatarUrl" style="cursor: pointer" :size="90" shape="square" fit="fit"
                           @click.native="$router.push('/user/profile/' + comment.creatorId)"
                           :src="comment.author.avatarUrl"></el-avatar>
                <el-avatar v-else style="cursor: pointer" :size="90" shape="square" fit="fit"
                           @click.native="$router.push('/user/profile/' + comment.creatorId)">
                  {{comment.author.username}}
                </el-avatar>
              </el-aside>
              <el-main class="comment-body">
                <div style="display: inline">
                  <a class="username" @click="$router.push('/user/profile/' + comment.creatorId)">{{(comment.author.username)}}</a>
                  <span style="float: right"
                        v-show="($store.state.isUserLogin && comment.creatorId === $store.state.user._id) || isPoster"
                        id="btn-delete" class="el-icon-close" @click="deleteComment(comment._id)"></span>
                </div>
                <div v-html="comment.content"></div>
                <div>
                  <span class="icons" @click="likeComment(comment,1,index)"
                        v-if="likedComments.indexOf(comment._id) < 0"><img src="../../static/img/like.png"/>{{comment.likeCount}}</span>
                  <span class="icons" @click="likeComment(comment,-1,index)"
                        v-if="likedComments.indexOf(comment._id) >= 0"><img src="../../static/img/liked.png"/>{{comment.likeCount}}</span>
                  <span class="icons" @click="showComments(comment._id,comment.creatorId)"><img
                    src="../../static/img/comment.png"/>{{comment.commentCount}}</span>
                  <!--                  <span><img class="icons" src="../../static/img/liked.png"/></span>-->
                  <span class="post-info" id="comment-time">{{comment.createdTime}}</span>
                </div>
              </el-main>
            </el-container>
            <el-divider class="comment-divider"/>
          </div>
          <div v-loading="quillUpdateImg" class="comment-input" style="height: 300px">
            <quill-editor ref="myTextEditor" v-model="comment" :options="editorOption"
                          ></quill-editor>
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
    <el-dialog @close="loadDetail($route.params.id)" v-if='showCommentsDialog' style="margin-top: -50px"
               title="comments" :destroy-on-close=true :visible.sync="showCommentsDialog" width="600px"
               :lock-scroll="true">
      <ShowComments ref="showComments" v-bind:commentId="selectedComment" v-bind:postId="this.$route.params.id"
                    v-bind:commentCreator="selectedCommentCreator"></ShowComments>
    </el-dialog>
    <el-upload id="picUploader" ref="upload" action="http://8.208.14.10:3000/upload"
               :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :auto-upload="true">
    </el-upload>
  </el-row>
</template>

<script>
import PostService from '../../services/PostService'
import CommentService from '../../services/CommentService'
import ShowComments from '../../components/ShowComments'
import moment from 'moment'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
// import * as Quill from 'quill'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['image'],
  ['clean'] // remove formatting button
]

export default {
  name: 'detail',
  components: {
    ShowComments,
    quillEditor
  },
  data () {
    return {
      post: {
        author: ''
      },
      comments: '',
      error: '',
      comment: '',
      quillUpdateImg: false,
      time: '',
      isPoster: false,
      showCommentsDialog: false,
      selectedComment: '',
      selectedCommentCreator: '',
      likedComments: [],
      editorOption: {
        placeholder: 'Edit your comment here',
        modules: {
          toolbar: {
            container: toolbarOptions, // toolbar
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('#picUploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  created () {
    this.loadDetail(this.$route.params.id)
    if (this.$store.state.isUserLogin) {
      this.likedComments = this.$store.state.user.likedComments
    }
  },
  methods: {
    loadDetail (id) {
      PostService.getPostDetail(id)
        .then(response => {
          var post = response.data.post
          post.createdTime = moment(post.createdTime).format('YYYY-MM-DD HH:mm')
          this.post = post
          this.comments = this.$formatTimeYear(response.data.comments)
          if (this.$store.state.isUserLogin && this.post.creatorId === this.$store.state.user._id) {
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
            type: 0,
            parentId: this.post._id,
            content: this.comment,
            creatorId: this.$store.state.user._id,
            receiverId: this.post.author._id,
            senderName: this.$store.state.user.username
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
    },
    async showComments (id, userId) {
      this.selectedComment = id
      this.selectedCommentCreator = userId
      this.showCommentsDialog = true
    },
    async likeComment (comment, type, index) {
      this.$likeComment(comment, type, index)
    },
    focusComment () {
      this.$nextTick(() => {
        this.$refs.myTextEditor.quill.enable(true)
        this.$refs.myTextEditor.quill.focus()
      })
    },
    onEditorChange ({ editor, html, text }) {
      this.content = html
    },
    beforeAvatarUpload (file) {
      this.quillUpdateImg = true
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('Upload image only in JPG/PNG format!')
      }
      if (!isLt2M) {
        this.$message.error('The size of uploaded picture cannot exceed 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleAvatarSuccess (res, file) {
      try {
        let quill = this.$refs.myTextEditor.quill
        if (res.code === '0000') {
          let length = quill.getSelection().index
          quill.insertEmbed(length, 'image', res.url)
          quill.setSelection(length + 1)
        } else {
          this.$message.error('Failed to insert picture')
        }
      } catch (e) {
        this.$message.error('Failed to insert picture')
      } finally {
        this.quillUpdateImg = false
        this.$refs.upload.clearFiles()
      }
    },
    deletePost () {
      this.$confirm('Are you sure to delete this post?', 'Delete', {
        confirmButtonText: 'CONFIRM',
        cancelButtonText: 'CANCEL',
        type: 'warning'
      }).then(async () => {
        PostService.deletePost(this.$route.params.id)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.success(res.data.msg)
              this.$router.push('/')
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
    border-radius: 15px;
  }

  .post-container {
    padding-left: 40px;
    background: white;
    padding-right: 40px;
  }

  .post-creator {
    border-radius: 15px;
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
    /*display: flex;*/
    margin-top: 10px;
    margin-bottom: 10px;
  }

  #btn-comment {
    margin-top: 10px;
    margin-bottom: 10px;
    /*margin-left: 10px;*/
    float: right;
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

  #comment-time {
    float: right;
  }

  .icons {
    color: gray;
    padding-right: 10px;
    cursor: pointer;

    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  .el-dialog {
    height: 642px;
  }

</style>
<style>
  /* global styles */
  .el-scrollbar .el-scrollbar__wrap {
    overflow: visible;
    overflow-x: hidden !important;
  }

  .el-dialog .el-dialog__body {
    padding-right: 5px !important;
  }

  .ql-editor{
    height:180px;
  }
</style>
