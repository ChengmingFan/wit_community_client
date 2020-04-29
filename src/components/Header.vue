<template>
  <el-row>
    <el-col>
      <div id="top">
        <span v-show="showMenu" @click="openDrawer" style="margin-left: -15px;margin-top: 2px" class="hidden-md-and-up"><img
          src="../static/img/menu.png" style="width: 30px;height: 30px"></span>
        <p @click=toIndex>WIT Community</p>
        <el-input id="search" style="width: 20%;margin-left: 28%;margin-right: auto" v-model="keywords"
                  placeholder="search post here ..." @keyup.enter.native="onEnterSearch" v-show="fullWidth">
          <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 0px"></i>
        </el-input>
        <div>
          <template v-if="!$store.state.isUserLogin">
            <span @click="login">Log in</span>&nbsp;
            <span @click="register">Sign up</span>
          </template>
          <template v-else>
            <div style="position: fixed;right: 20px;top:10px; text-align: center;margin-top: 0;">
              <span class="header_icons" @click="$router.push('/post/create')" style="margin-right: 10px"
                    v-show="fullWidth">
                <i style="font-size: 25px" class="el-icon-edit-outline"></i>
                <el-badge/>
              </span>
              <span class="header_icons" v-show="fullWidth" v-popover:notification @click="showNotification">
                <i class="el-icon-bell" style="font-size: 25px"></i>
                <el-badge v-show="notificationNum !== 0" class="mark" :value="notificationNum"/>
                <el-popover ref="notification" placement="bottom" width="200" trigger="click">
                  <ul style="list-style: none;padding-left: 0;height: 200px;margin: -5px -10px 5px;">
                    <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
                      <li v-if="notificationList.length === 0"><div
                        style="width: 150px;height: 100px;margin-left: 50px;margin-top: 50px">No Notifications</div></li>
                     <li v-else v-for="notification in notificationList" v-bind:key="notification._id"
                         style="margin-right: 5px">
                       <div v-bind:class="{read: notification.status === 1,unread: notification.status === 0}"
                            style="width: 210px">
                         <router-link target="_blank" :to="{path:'/user/profile/' + notification.senderId}">{{notification.senderName}}</router-link>
                         <span v-if="notification.type === 1"> liked your comment: </span>
                         <span v-else-if="notification.type === 2"> commented your post: </span>
                         <span v-else> replied your comment: </span>
                         <div class="notification-content" @click="getDetail(notification.postId,notification._id)">{{notification.content}}</div>
                       </div>
                      </li>
                    </el-scrollbar>
                  </ul>
                  <span v-if="notificationNum != 0" style="margin-left: 45px"><el-button
                    @click="markRead">Mark Read</el-button></span>
                </el-popover>
              </span>
              <span class="header_icons" v-show="fullWidth" v-popover:message @click="showMessenger">
                <i class="el-icon-message" style="font-size: 25px"></i>
                <el-badge v-show="messageNum !== 0" class="mark" :value="messageNum"/>
                <el-popover ref="message" placement="bottom" width="200" trigger="click">
                  <ul
                    style="list-style: none;padding-left: 0;margin-top: -5px;height: 200px;margin-bottom: 5px;margin-right: -10px">
                    <el-scrollbar ref="myScrollbar" style="width: 100%;height: 100%">
                      <li v-if="messengerList.length === 0"><div
                        style="width: 150px;height: 100px;margin-left: 50px;margin-top: 50px">No Messages</div></li>
                     <li v-else v-for="messenger in messengerList" v-bind:key="messenger._id.senderId"
                         style="margin-right: 9px;cursor: pointer"
                         @click="showMessageDialog(messenger.userId,messenger.username,messenger.unreadNum)">
                         <div
                           v-bind:class="{read: messenger.lastModifiedBy === user.username || messenger.unreadNum === 0,unread: messenger.lastModifiedBy !== user.username && messenger.unreadNum != 0}"
                           style="display: flex">
                           <el-avatar v-if="messenger.userAvatar" class="user_avatar" :size="50" shape="square"
                                      fit="fit" :src="messenger.userAvatar"> </el-avatar>
                           <el-avatar v-else class="user_avatar" :size="50" shape="square" fit="fit"> {{messenger.username}} </el-avatar>
                           <div style="float: right;margin-left: 5px;width: 100px">
                             <span style="font-weight: bold">{{messenger.username}}</span><br/>
                             <div class="message-content">{{messenger.content}}</div>
                           </div>
                           <el-badge v-show="messenger.unreadNum !== 0" style="margin-top: 17px;margin-left: 10px"
                                     :value="messenger.unreadNum"/>
                       </div>
                      </li>
                    </el-scrollbar>
                  </ul>
                </el-popover>
              </span>
              <el-dropdown>
                      <span class="el-dropdown-link" style="font-size: 20px;">
                        {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="$router.push('/user/profile/' + user._id)">Profile</span>
                  </el-dropdown-item>
                  <el-dropdown-item><span @click="logout">Logout</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </div>
      </div>
    </el-col>
    <el-dialog :before-close="close" :title="dialogTitle" :visible.sync="dialogTableVisible" center
               :append-to-body='true' :lock-scroll="false" width="40%">
      <Login ref="loginDialog" v-show="loginDialogTableVisible" @register="register" v-on:hidden="close"></Login>
      <Register ref="registerDialog" v-show="registerDialogTableVisible" v-on:login="login"></Register>
    </el-dialog>
    <el-dialog @close="closeMessageDialog" title="Message" :visible.sync="messageDialogVisible" center
               :append-to-body="true" :destroy-on-close=true :lock-scroll="true" width="40%" style="margin-top: -70px">
      <Chat></Chat>
    </el-dialog>
    <el-drawer
      title="SUBAREA"
      :visible.sync="drawer"
      direction="ltr">
      <div>
        <el-menu id="sideBar"
                 default-active="1"
                 class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="showSubarea('Popular','popular')">
            <i class="el-icon-thumb"></i>
            <span slot="title">popular</span>
          </el-menu-item>
          <el-menu-item index="2" @click="showSubarea('All','all')">
            <i class="el-icon-view"></i>
            <span slot="title">all post</span>
          </el-menu-item>
          <el-menu-item index="3" @click="showSubarea('Accommodation','accommodation')">
            <i class="el-icon-house"></i>
            <span slot="title">accommodation</span>
          </el-menu-item>
          <el-menu-item index="4" @click="showSubarea('Sale','sale')">
            <i class="el-icon-shopping-cart-2"></i>
            <span slot="title">sale</span>
          </el-menu-item>
          <el-menu-item index="5" @click="showSubarea('Activity','activity')">
            <i class="el-icon-time"></i>
            <span slot="title">activity</span>
          </el-menu-item>
          <el-menu-item index="6" @click="showSubarea('Study','study')">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">study</span>
          </el-menu-item>
          <el-menu-item index="7" @click="showSubarea('Other','other')">
            <i class="el-icon-more-outline"></i>
            <span slot="title">other</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>
  </el-row>
</template>

<script>
import Register from './Register'
import Login from './Login'
import NotificationService from '../services/NotificationService'
import MessageService from '../services/MessageService'
import Chat from './Chat'

export default {
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
      messengerList: '',
      messageDialogVisible: this.$store.state.messageDialogVisible,
      drawer: false,
      showMenu: false
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
      this.getUnreadMessageNum()
      this.getUnreadNotificationNum()
    },
    logout () {
      this.$store.dispatch('setToken', '')
      this.$store.dispatch('setUser', '')
      this.$message.success({
        message: 'Logout successfully',
        center: true
      })
      // location.reload()
    },
    onEnterSearch () {
      this.$router.push({ name: 'post-search', params: { keywords: this.keywords } })
    },
    toIndex () {
      this.$router.push('/')
      this.keywords = ''
    },
    async getUnreadNotificationNum () {
      const response = await NotificationService.getUnreadNum(this.user._id)
      if (response.data.code === 1) {
        this.notificationNum = response.data.unreadNotificationNum
      }
    },
    async getUnreadMessageNum () {
      const response = await MessageService.getUnreadNum(this.user._id)
      if (response.data.code === 1) {
        this.messageNum = response.data.unreadMessageNum
      }
    },
    async showNotification () {
      NotificationService.getNotifications(this.user._id)
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
    showMessenger () {
      MessageService.getMessengerList(this.user.username)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.error({
              message: 'error',
              center: true
            })
          } else {
            this.messengerList = res.data.messenger
          }
        })
    },
    getDetail (postId, notificationId) {
      NotificationService.markOneRead(notificationId)
        .then(res => {
          if (res.data.code === 1) {
            this.notificationNum = this.notificationNum - 1
            this.showNotification()
            let routeUrl = this.$router.resolve({
              name: 'post-detail',
              params: {
                id: postId
              }
            })
            window.open(routeUrl.href, '_blank')
          }
        })
    },
    async markRead () {
      NotificationService.markAllRead(this.user._id)
        .then(response => {
          console.log(response.data)
          if (response.data.code === 1) {
            this.notificationNum = 0
            this.showNotification()
          }
        })
    },
    closeMessageDialog () {
      // this.$store.dispatch('setMessageDialogVisible', false)
      this.$store.dispatch('setReceiver', null)
      this.messageDialogVisible = false
    },
    async showMessageDialog (id, name, unreadNum) {
      let receiver = {
        _id: id,
        username: name
      }
      this.$store.dispatch('setReceiver', receiver)
      await MessageService.markRead({
        userId: this.user._id,
        senderId: id
      }).then(res => {
        if (res.data.code === 1) {
          this.showMessenger()
          this.messageNum = this.messageNum - unreadNum
        }
      })
    },
    openDrawer () {
      this.drawer = !this.drawer
    },
    showSubarea (name, key) {
      let subarea = {
        name: name,
        key: key
      }
      this.$store.dispatch('setCurrentSubarea', subarea)
      this.drawer = false
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
      this.getUnreadMessageNum()
    }
    if (this.currentPath === '/') {
      this.showMenu = true
    }
  },
  computed: {
    messageDialog () {
      return this.$store.state.receiver
    },
    user () {
      return this.$store.state.user
    },
    currentPath () {
      return this.$route.path
    }
  },
  watch: {
    messageDialog: function (val, oldval) {
      this.messageDialogVisible = val !== null
    },
    currentPath (val, oldval) {
      this.showMenu = val === '/'
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
    margin-top: 5px;
    width: 200px;
  }

  .read:hover {
    background-color: #f6f6f6;
  }

  .unread {
    background-color: #f6f6f6;
    padding: 10px 5px;
    margin-top: 5px;
    width: 200px;
  }

  .message-content {
    color: gray;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .notification-content {
    color: #409EFF;;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

</style>
