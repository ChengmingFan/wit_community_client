<template>
  <el-row>
    <el-col>
      <div id="top">
        <p @click=toIndex>WIT Community</p>
        <el-input id="search" style="width: 20%;margin-left: auto;margin-right: auto" v-model="keywords"
                  placeholder="search post here ..." @keyup.enter.native="onEnterSearch" v-show="fullWidth">
          <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 0px"></i>
        </el-input>
        <div>
          <template v-if="!$store.state.isUserLogin">
            <span @click="login">Log in</span>&nbsp;
            <span @click="register">Sign up</span>
          </template>
          <template v-else>
            <div style="position: fixed;right: 20px;top:10px; text-align: center;margin-top: 0">
              <span class="header_icons" @click="$router.push('/post/create')" style="margin-right: 10px"
                    v-show="fullWidth">
                <i style="font-size: 25px" class="el-icon-edit-outline"></i>
                <el-badge/>
              </span>
              <span class="header_icons" v-show="fullWidth" v-popover:notification @click="showNotification">
                <i class="el-icon-bell" style="font-size: 25px"></i>
                <el-badge v-show="notificationNum !== 0" class="mark" :value="notificationNum"/>
                <el-popover ref="notification" placement="bottom" width="200" trigger="click">
                  <ul style="list-style: none;padding-left: 0;margin-top: -5px;height: 200px;margin-bottom: 5px">
                    <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
                      <li v-if="notificationNum === 0"><div
                        style="width: 150px;height: 100px;margin-left: 50px;margin-top: 50px">No Notifications</div></li>
                     <li v-else v-for="notification in notificationList" v-bind:key="notification._id">
                       <div v-bind:class="{read: notification.status == 1,unread: notification.status === 0}">
                          <a
                            @click="$router.push('/user/profile/' + notification.senderId)">{{notification.senderName}} </a>
                         <span v-if="notification.type === 1">liked your comment </span>
                         <span v-else-if="notification.type === 2">commented your post </span>
                         <span v-else>replied your comment </span>
                         <a @click="getDetail(notification.parentId)">{{notification.content}}</a>
                       </div>
                      </li>
                    </el-scrollbar>
                  </ul>
                  <span v-if="notificationNum != 0" style="margin-left: 45px"><el-button
                    @click="markRead">Mark Read</el-button></span>
                </el-popover>
              </span>
              <span class="header_icons" v-show="fullWidth" v-popover:message>
                <i class="el-icon-message" style="font-size: 25px"></i>
                <el-badge v-show="messageNum !== 0" class="mark" :value="messageNum"/>
                <el-popover ref="message" placement="bottom" width="200" trigger="click" style="display: none">
                       <ul style="list-style: none;padding-left: 0;margin-top: -5px;height: 200px;margin-bottom: 5px">
                    <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
                      <li v-if="messageNum === 0"><div
                        style="width: 150px;height: 100px;margin-left: 50px;margin-top: 50px">No Messages</div></li>
<!--                     <li v-else v-for="notification in notificationList" v-bind:key="notification._id">-->
<!--                       <div v-bind:class="{read: notification.status == 1,unread: notification.status === 0}">-->
<!--                          <a-->
<!--                            @click="$router.push('/user/profile/' + notification.senderId)">{{notification.senderName}} </a>-->
<!--                         <span v-if="notification.type === 1">liked your comment </span>-->
<!--                         <span v-else-if="notification.type === 2">commented your post </span>-->
<!--                         <span v-else>replied your comment </span>-->
<!--                         <a @click="getDetail(notification.parentId)">{{notification.content}}</a>-->
<!--                       </div>-->
<!--                      </li>-->
                    </el-scrollbar>
                  </ul>
                </el-popover>
              </span>
              <el-dropdown>
                      <span class="el-dropdown-link" style="font-size: 20px;">
                        {{$store.state.user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="$router.push('/user/profile/' + $store.state.user._id)">Profile</span>
                  </el-dropdown-item>
                  <el-dropdown-item><span @click="logout">Logout</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </div>
        <el-dialog :before-close="close" :title="dialogTitle" :visible.sync="dialogTableVisible" center
                   :append-to-body='true' :lock-scroll="false" width="40%">
          <Login ref="loginDialog" v-show="loginDialogTableVisible" @register="register" v-on:hidden="close"></Login>
          <Register ref="registerDialog" v-show="registerDialogTableVisible" v-on:login="login"></Register>
        </el-dialog>
        <el-dialog @close="closeMessageDialog" title="Message" :visible.sync="messageDialogVisible" center :append-to-body="true" :destroy-on-close=true :lock-scroll="true" width="40%" style="margin-top: -70px">
          <Chat></Chat>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Register from './Register'
import Login from './Login'
import NotificationService from '../services/NotificationService'
import Chat from './Chat'

export default {
  // todo:通知栏跳转到对应的位置
  name: 'header',
  props: ['fullWidth'],
  data () {
    return {
      keywords: '',
      visible: false,
      dialogTitle: '',
      dialogTableVisible: false,
      loginDialogTableVisible: false,
      registerDialogTableVisible: false,
      notificationVisible: false,
      notificationNum: 0,
      messageNum: 0,
      notificationList: '',
      messageDialogVisible: this.$store.state.messageDialogVisible
    }
  },
  methods: {
    login () {
      this.dialogTitle = 'Log in'
      this.dialogTableVisible = true
      this.registerDialogTableVisible = false
      this.loginDialogTableVisible = true
    },
    register () {
      this.dialogTitle = 'Sign up'
      this.dialogTableVisible = true
      this.loginDialogTableVisible = false
      this.registerDialogTableVisible = true
    },
    close () {
      this.dialogTableVisible = false
      this.$refs.loginDialog.close()
      this.$refs.registerDialog.close()
    },
    logout () {
      this.$store.dispatch('setToken', '')
      this.$store.dispatch('setUser', '')
      this.$message.success({
        message: 'Logout successfully',
        center: true
      })
      location.reload()
    },
    onEnterSearch () {
      this.$router.push({ name: 'post-search', params: { keywords: this.keywords } })
    },
    toIndex () {
      this.$router.push('/')
      this.keywords = ''
    },
    async getUnreadNotificationNum () {
      const response = await NotificationService.getUnreadNum(this.$store.state.user._id)
      if (response.data.code === 1) {
        this.notificationNum = response.data.unreadNotificationNum
      }
    },
    async showNotification () {
      NotificationService.getNotifications(this.$store.state.user._id)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.error({
              message: 'error',
              center: true
            })
          } else {
            this.notificationList = response.data.notifications
          }
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
    async markRead () {
      NotificationService.markRead(this.$store.state.user._id)
        .then(response => {
          console.log(response.data)
          if (response.data.code === 1) {
            this.notificationNum = 0
            this.showNotification()
          }
        })
    },
    closeMessageDialog () {
      this.$store.dispatch('setMessageDialogVisible', false)
      this.messageDialogVisible = false
    }
  },
  components: {
    Chat,
    Register,
    Login
  },
  created () {
    if (this.$store.state.isUserLogin) {
      this.getUnreadNotificationNum()
    }
  },
  computed: {
    messageDialog () {
      return this.$store.state.messageDialogVisible
    }
  },
  watch: {
    messageDialog: function (val, oldval) {
      this.messageDialogVisible = val
      console.log(this.messageDialogVisible)
    }
  }
}
</script>

<style lang="scss">
  #top {
    margin-top: 3px;
    display: flex;
    background: white;
    align-items: center;
    color: gray;

    p {
      margin: 5px 0;
      /*margin-right: auto;*/
      font-size: 25px;
      cursor: pointer;
    }

    span {
      margin-left: 5px;
      cursor: pointer;
    }

    span:hover {
      color: #409EFF;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: gray;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .mark {
    margin-bottom: 20px;
    margin-left: -10px;
  }

  .el-popper[x-placement^=bottom] {
    margin-top: 0 !important;
  }

  .header_icons {
    display: inline-block;
    width: 50px;
    height: 44.725px;
  }

  .el-popover {
    top: 54px !important;
    padding-bottom: 3px !important;
  }

  .read {
    padding: 10px 5px;
    margin-top: 5px
  }

  .read:hover {
    background-color: #f6f6f6;
  }

  .unread {
    background-color: #f6f6f6;
    padding: 10px 5px;
    margin-top: 5px
  }

</style>
