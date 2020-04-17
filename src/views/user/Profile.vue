<template>
  <el-row id="main">
    <el-col :xs="24" :sm="15" :md="16" :lg="18" :xl="18" >
      <div id="post-info">
        <div id="nav">
          <div class="label" v-for="(item,index) in items" v-bind:key="item.index" :class="{'active':index === isActive}" @click="checkItem(index)">{{item.text}}</div>
        </div>
        <div id="content">
          <el-container style="height: auto" v-for="post in showPosts" v-bind:key="post._id" :v-if="isShowPosts">
            <el-main class="post-body">
              <a class="title" @click="getDetail(post._id)">{{post.title}}</a>
              <p>{{post.content}}</p>
              <div class="post-info">
                <span>Views: {{post.viewCount}} · </span>
                <span>Comments: {{post.commentCount}} · </span>
                <span>Time: {{post.createdTime}}</span>
              </div>
            </el-main>
          </el-container>
          <div id="comment" v-for="comment in showComments" v-bind:key="comment._id" :v-if="isShowComments">
            <div id="comment-post">
              <p><span style="color: #409EFF">{{user.username}}</span><span style="color: gray"> commented on <a @click="$router.push('/post/detail/' + comment.post._id)">{{comment.post.title}}</a></span></p>
            </div>
            <el-divider/>
            <div id="comment-detail">
              <span style="font-weight: bold">{{user.username}}</span> <span class="post-info">{{comment.createdTime}}</span>
              <p>{{comment.content}}</p>
            </div>
          </div>
        </div>
      </div>
      <el-dialog  title="Edit" :before-close="close" :destroy-on-close=true :visible.sync="showEditDialog" width="40%" :lock-scroll="true">
        <EditProfile v-show="true" v-on:close="close"/>
      </el-dialog>
    </el-col>
    <el-col :xs="0" :sm="9" :md="8" :lg="6" :xl="6">
      <div id="user-info">
        <div id="top"></div>
        <el-avatar v-if="user.avatarUrl" class="avatar" shape="square" :size="90" fit="fill" :src=user.avatarUrl></el-avatar>
        <el-avatar v-else class="avatar" shape="square" :size="90" fit="fill">{{user.username}}</el-avatar>
        <div id="follow-info">
          <span>Following</span>
          <span style="margin-left: 10px">Follower</span><br/>
          <span id="follow-number">1</span>
          <span id="follower-number">1</span>
        </div>
        <span id="username">{{user.username}}</span><br/>
        <span id="bio">{{user.bio}}</span>
        <div style="margin-top: 10px">
          <span class="info-icon"><img src="../../static/img/country.png" style="width: 33px;height: 33px;margin-top: -3px">&nbsp;From {{user.country}}</span>
          <span class="info-icon"><img src="../../static/img/calendar.png" style="width: 23px;height: 23px">&nbsp;Joined {{user.createdTime}}</span>
        </div>
        <div v-if="!isSelf">
          <el-button type="primary">Follow</el-button>
          <el-button type="primary" @click="showMessageDialog">Message</el-button>
        </div>
        <div v-else>
          <el-button style="margin-left: 30%" type="plain" @click="edit">Edit profile</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import EditProfile from '../../components/EditProfile'
import UserService from '../../services/UserService'

let moment = require('moment')

export default {
  name: 'Profile',
  data () {
    return {
      showEditDialog: false,
      user: '',
      isSelf: false,
      items: [
        { text: 'Posts' },
        { text: 'Comments' },
        { text: 'Likes' },
        { text: 'Follow' },
        { text: 'Follower' }
      ],
      isActive: 0,
      allPosts: [],
      showPosts: [],
      total: 0,
      page: 1,
      pagesize: 3,
      allComments: [],
      showComments: [],
      isShowPosts: true,
      isShowComments: false
    }
  },
  created () {
    this.loadUser(this.$route.params.id)
    this.loadUserPost(this.$route.params.id)
  },
  watch: {
    '$route' () {
      this.loadUser(this.$route.params.id)
      this.loadUserPost(this.$route.params.id)
    }
  },
  methods: {
    edit () {
      this.showEditDialog = true
    },
    loadUser (id) {
      UserService.getUserById(id)
        .then(response => {
          if (response.data.code === 1) {
            this.user = response.data.user
            this.user.createdTime = moment().format('MMMM YYYY')
            if (this.$store.state.isUserLogin && response.data.user._id === this.$store.state.user._id) {
              this.isSelf = true
            }
          } else {
            this.$message.error({
              message: response.data().msg,
              center: true
            })
          }
        })
        .catch(error => {
          this.$message.error({
            message: error,
            center: true
          })
        })
    },
    loadUserPost (id) {
      UserService.getPostsByUserID(id)
        .then(response => {
          this.allPosts = response.data.posts
          this.formatPost()
        })
    },
    loadUserComment (id) {
      UserService.getCommentsByUserId(id)
        .then(response => {
          this.allComments = response.data.comments
          this.formatComment()
        })
    },
    getDetail (id) {
      this.$router.push({
        name: 'post-detail',
        params: {
          id: id
        }
      })
    },
    formatPost () {
      var showPosts = this.allPosts.slice(0, 3)
      for (var i = 0; i < showPosts.length; i++) {
        showPosts[i].createdTime = moment(showPosts[i].createdTime).format('YYYY-MM-DD HH:mm')
      }
      this.showPosts = showPosts
      this.total = this.allPosts.length
    },
    formatComment () {
      var showComments = this.allComments.slice(0, 3)
      for (var i = 0; i < showComments.length; i++) {
        showComments[i].createdTime = moment(showComments[i].createdTime).format('MMMM Do YYYY, h:mm:ss a')
      }
      this.showComments = showComments
    },
    close () {
      this.showEditDialog = false
      this.loadUser(this.$route.params.id)
    },
    checkItem (index) {
      this.isActive = index
      switch (index) {
        case 0:
          this.showPosts = true
          this.showComments = false
          this.loadUserPost(this.$route.params.id)
          break
        case 1:
          this.loadUserComment(this.$route.params.id)
          this.showPosts = false
          this.showComments = true
          break
      }
    },
    showMessageDialog () {
      this.$store.dispatch('setReceiver', this.user)
    }
  },
  components: {
    EditProfile
  }
}
</script>

<style lang="scss">

  #post-info {
    width: auto;
    height: 600px;
    padding-right: 10px;
    background: white;
    border-radius: 15px;
    display: flex;
  }

  #user-info {
    display: block;
    width: 92%;
    height: 300px;
    background: white;
    margin-left: 30px;
    border-radius: 15px;
    #top{
      margin-top: 0;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      background: cornflowerblue;
      height: 100px;
    }
    .avatar{
      border-radius: 10px;
      margin-left: 15px;
      margin-top: -45px;
    }
    #follow-info{
      margin-left: 40%;
      margin-top: -45px;
      #follow-number{
        margin-left: 35px;
      }
      #follower-number{
        margin-left: 65px;
      }
    }
    #username{
      margin-left: 23px;
      font-weight: bold;
    }
    #bio{
      margin-top: 10px;
      font-size: 15px;
      margin-left: 24px;
    }
    .info-icon{
      margin-top: 10px;
      font-size: 15px;
      margin-left: 10px;
      color: #808080;
      img{
        vertical-align: middle;
      }
    }
    .el-button{
      margin-top: 20px;
      width: 100px;
      margin-left: 23px;
    }
  }
  #post-info {
    #nav {
      border-right: solid 1px grey;
      display: inline-block;
      margin-top: 10px;
      height: 97%;
      float:left
    }
    .label {
      margin-left: 20px;
      margin-top: 20px;
      font-size: 25px;
      cursor: pointer;
      padding-right: 10px;
    }
    .label:hover {
      color: #409EFF;
    }
    .active {
      color: #409EFF;
    }
    #content {
      width: 70%;
      margin-left: 20px;
      float:left
    }
  }
  .post-info {
    color: gray;
    margin-top: 23px;
    font-size: 12px;
  }
  #comment{
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 15px;
    border: solid 1px lightgray;
    border-radius: 15px;
    width: 100%;
    margin-left: 20px;
    #comment-detail{
      padding: 10px;
      border-radius: 15px;
      margin-left: 20px;
      /*background: lightsteelblue ;*/
      background: rgba(64,158,255, 0.1) none repeat scroll !important;
    }
  }
  .el-divider--horizontal {
    margin: 5px 0 10px 0 !important;
  }
</style>
