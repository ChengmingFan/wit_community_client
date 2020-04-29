<template>
  <el-row id="main">
      <div id="post-info">
        <div id="nav">
          <div class="label" v-for="(item,index) in items" v-bind:key="item.index"
               :class="{'active':index === isActive}" @click="checkItem(index)">{{item.text}}
          </div>
        </div>
        <div id="content">
          <el-scrollbar style="width: 100%;height: 100%" v-if="isShowPosts">
            <el-container class="post" v-for="post in allPosts" v-bind:key="post._id" :v-if="isShowPosts">
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
          </el-scrollbar>
          <el-scrollbar style="width: 100%;height: 100%" v-if="isShowComments">
            <div class="comment" v-for="comment in allComments" v-bind:key="comment._id" :v-if="isShowComments">
              <div id="comment-post">
                <p><span style="color: #409EFF">{{user.username}}</span><span style="color: gray"> commented on <a
                  @click="$router.push('/post/detail/' + comment.post._id)">{{comment.post.title}}</a></span></p>
              </div>
              <el-divider/>
              <div id="comment-detail">
                <span style="font-weight: bold">{{user.username}}</span> <span
                class="post-info">{{comment.createdTime}}</span>
                <div id="comment-content" style="overflow-x: hidden" v-html="comment.content"></div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <el-dialog title="Edit" :before-close="close" :destroy-on-close=true :visible.sync="showEditDialog" width="40%"
                 :lock-scroll="true">
        <EditProfile v-show="true" v-on:close="close"/>
      </el-dialog>
      <div id="user-info">
        <div id="top"></div>
        <el-avatar v-if="user.avatarUrl" class="avatar" shape="square" :size="90" fit="fill"
                   :src=user.avatarUrl></el-avatar>
        <el-avatar v-else class="avatar" shape="square" :size="90" fit="fill">{{user.username}}</el-avatar>
        <span id="username">{{user.username}}</span><br/>
        <span id="bio">{{user.bio}}</span>
        <div style="margin-top: 10px">
          <span class="info-icon"><img src="../../static/img/country.png"
                                       style="width: 33px;height: 33px;margin-top: -3px">&nbsp;From {{user.country}}</span>
          <span class="info-icon"><img src="../../static/img/calendar.png" style="width: 23px;height: 23px">&nbsp;Joined {{user.createdTime}}</span>
        </div>
        <div v-if="!isSelf" style="padding-left: 80px">
          <el-button  type="primary" @click="showMessageDialog">Message</el-button>
        </div>
        <div v-else>
          <el-button style="margin-left: 30%" type="plain" @click="edit">Edit profile</el-button>
        </div>
      </div>
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
        { text: 'Comments' }
      ],
      isActive: 0,
      allPosts: [],
      total: 0,
      allComments: [],
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
          this.allPosts = this.$formatTimeYear(response.data.posts)
        })
    },
    loadUserComment (id) {
      UserService.getCommentsByUserId(id)
        .then(response => {
          this.allComments = this.$formatTimeClock(response.data.comments)
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
    close () {
      this.showEditDialog = false
      this.loadUser(this.$route.params.id)
    },
    checkItem (index) {
      this.isActive = index
      switch (index) {
        case 0:
          this.isShowPosts = true
          this.isShowComments = false
          this.loadUserPost(this.$route.params.id)
          break
        case 1:
          this.loadUserComment(this.$route.params.id)
          this.isShowComments = true
          this.isShowPosts = false
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
  #main {
    margin-left: 13px;
    display: -webkit-box;
  }
  #post-info {
    width: 1054px;
    height: 600px;
    padding-right: 10px;
    background: white;
    border-radius: 15px;
    display: flex;
  }

  #user-info {
    display: block;
    width: 330px;
    height: 300px;
    background: white;
    margin-left: 60px;
    border-radius: 15px;

    #top {
      margin-top: 0;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      background: cornflowerblue;
      height: 100px;
    }

    .avatar {
      border-radius: 10px;
      margin-left: 15px;
      margin-top: -45px;
    }

    #username {
      display: block;
      margin-top: -40px;
      margin-left: 110px;
      font-weight: bold;
      font-size: 20px;
    }

    #bio {
      margin-top: 10px;
      font-size: 15px;
      margin-left: 24px;
    }

    .info-icon {
      margin-top: 10px;
      font-size: 15px;
      margin-left: 10px;
      color: #808080;

      img {
        vertical-align: middle;
      }
    }

    .el-button {
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
      float: left
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
      width: 880px;
      margin-left: 20px;
      float: left
    }
  }

  .post-info {
    color: gray;
    margin-top: 23px;
    font-size: 12px;
  }

  .post {
    width: 90%;
    height: auto;
    border-radius: 15px;
    border: 1px lightgray solid;
    margin-top: 20px!important;
  }

  .comment {
    width: 840px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 15px;
    border: solid 1px lightgray;
    border-radius: 15px;
    /*margin-left: 20px;*/

    #comment-detail {
      padding: 10px;
      border-radius: 15px;
      margin-left: 20px;
      /*background: lightsteelblue ;*/
      background: rgba(64, 158, 255, 0.1) none repeat scroll !important;
    }
  }

  .el-divider--horizontal {
    margin: 5px 0 10px 0 !important;
  }

</style>
