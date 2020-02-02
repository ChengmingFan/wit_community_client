<template>
  <el-container>
    <el-header class="header" height="50px">
      <p @click=toIndex>WIT Community</p>
      <el-input id="search"  style="width: 20%;margin-left: auto;margin-right: auto" v-model="keywords"
                placeholder="search post here ..." @keyup.enter.native="onEnterSearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div>
        <template v-if="!$store.state.isUserLogin">
          <span @click="login">Log in</span>&nbsp;
          <span @click="register">Sign up</span>
        </template>
        <template v-else>
          <div>
            <span @click="$router.push('/post/create')"><i class="el-icon-edit-outline"></i> Create</span>
            <el-dropdown>
                      <span class="el-dropdown-link">
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
    </el-header>
    <el-main id="container">
      <el-dialog :before-close="close" :title="dialogTitle" :visible.sync="dialogTableVisible" center
                 :append-to-body='true' :lock-scroll="false" width="40%">
        <Login ref="loginDialog" v-show="loginDialogTableVisible" @register="register" v-on:hidden="close"></Login>
        <Register ref="registerDialog" v-show="registerDialogTableVisible" v-on:login="login"></Register>
      </el-dialog>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Login from '../../components/Login'
import Register from '../../components/Register'

export default {
  name: 'Home',
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
    Login,
    Register
  }
}
</script>

<style lang="scss" scoped>
  .header {
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
