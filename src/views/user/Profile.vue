<template>
    <el-row id="main">
      <el-col :xs="24" :sm="15" :md="16" :lg="18" :xl="18" >
        <div id="post-info">
          <el-tabs tab-position="top" style="height: 200px;margin-left: 10px">
            <el-tab-pane label="Posts">Posts</el-tab-pane>
            <el-tab-pane label="Replies">Replies</el-tab-pane>
            <el-tab-pane label="Likes">Likes</el-tab-pane>
          </el-tabs>
        </div>
        <el-dialog  title="Edit" :before-close="close" :destroy-on-close=true :visible.sync="showEditDialog" width="40%" :lock-scroll="true">
          <EditProfile v-show="true" v-on:close="close"/>
        </el-dialog>
      </el-col>
      <el-col :xs="0" :sm="9" :md="8" :lg="6" :xl="6">
        <div id="user-info">
          <div id="top"></div>
          <el-avatar id="avatar" shape="square" :size="90" fit="fill" :src=user.avatarUrl></el-avatar>
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
            <el-button type="primary">Message</el-button>
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
      isSelf: false
    }
  },
  created () {
    this.loadUser(this.$route.params.id)
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
    close () {
      this.showEditDialog = false
      this.loadUser(this.$route.params.id)
    }
  },
  components: {
    EditProfile
  }
}
</script>

<style lang="scss" scoped>

  #post-info {
    width: auto;
    height: 600px;
    padding-right: 10px;
    background: white;
    border-radius: 15px;
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
    #avatar{
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
</style>
