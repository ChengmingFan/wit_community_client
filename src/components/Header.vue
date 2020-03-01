<template>
  <el-row>
    <el-col>
      <div id="top">
        <p @click=toIndex>WIT Community</p>
        <el-input id="search"  style="width: 20%;margin-left: auto;margin-right: auto" v-model="keywords"
                  placeholder="search post here ..." @keyup.enter.native="onEnterSearch" v-show="fullWidth">
          <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: -20px"></i>
        </el-input>
        <div>
          <template v-if="!$store.state.isUserLogin">
            <span @click="login">Log in</span>&nbsp;
            <span @click="register">Sign up</span>
          </template>
          <template v-else>
            <div style="position: fixed;right: 0;top:10px; text-align: center;margin-top: 0" >
              <span @click="$router.push('/post/create')" style="font-size: 25px" v-show="fullWidth"><i class="el-icon-edit-outline"></i></span>
              <span v-show="fullWidth"><i class="el-icon-bell" style="font-size: 25px"></i></span>
              <span v-show="fullWidth"><i class="el-icon-message" style="font-size: 25px"></i></span>
              <el-dropdown>
                      <span class="el-dropdown-link" style="font-size: 20px">
                        {{$store.state.user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="$router.push('/user/update')">Update Info</span></el-dropdown-item>
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
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Register from './Register'
import Login from './Login'
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
      registerDialogTableVisible: false
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
    },
    onEnterSearch () {
      this.$router.push({ name: 'post-search', params: { keywords: this.keywords } })
    },
    toIndex () {
      this.$router.push('/')
      this.keywords = ''
    }
  },
  components: {
    Register,
    Login
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
      margin-left: 20px;
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
</style>
