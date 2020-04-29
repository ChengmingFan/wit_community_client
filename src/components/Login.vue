<template>
  <section style="text-align: center;">
    <el-container>
      <el-form status-icon :rules="loginRules" :model="loginForm" ref="loginForm">
<!--        <div class="error-msg" v-show="error">{{error}}</div>-->
        <el-row>
          <el-col>
            <el-form-item label="" prop="username">
              <el-input name="username" v-model="loginForm.username" placeholder="username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="password">
              <el-input name="password" v-model="loginForm.password" type="password" placeholder="password" auto-complete="new-password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-container>
    <div class="signup">
        <span>New to Community? </span>
        <a @click="register">SIGN UP</a>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :plain="true" @click="submitForm()">LOG IN</el-button><br/>
      <el-button v-google-signin-button="clientId" :plain="true"> Continue with Google</el-button>
    </div>
  </section>
</template>
<script>
import UserService from '../services/UserService'
import GoogleSignInButton from 'vue-google-signin-button-directive'
import jsonwebtoken from 'jsonwebtoken'

export default {
  directives: {
    GoogleSignInButton
  },
  name: 'Login',
  data () {
    return {
      // error: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: { type: 'string', required: true, min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur' },
        password: { type: 'string', required: true, message: 'Password can not be null', trigger: 'blur' }
      },
      clientId: '448274896912-3ic6mobpcn1n44sccincd3677qupf153.apps.googleusercontent.com'
    }
  },
  methods: {
    register () {
      this.$emit('register')
    },
    close () {
      this.$refs['loginForm'].resetFields()
      this.error = ''
    },
    submitForm () {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          try {
            const response = await UserService.login({
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            if (response.data.code === 0) {
              this.$message.error({
                message: response.data.msg,
                center: true
              })
            } else {
              this.$store.dispatch('setToken', response.data.token)
              this.$store.dispatch('setUser', response.data.user)
              this.hidden()
              // location.reload()
            }
          } catch (e) {
            this.$message.error('Failed to log in. Please retry later')
          }
        }
      })
    },
    hidden () {
      this.$emit('hidden')
    },
    OnGoogleAuthSuccess (idToken) {
      let googleUser = jsonwebtoken.decode(idToken)
      console.log(googleUser)
      let user = {
        username: googleUser.name,
        email: googleUser.email,
        gid: googleUser.sub
      }
      UserService.getUserByGid(user)
        .then(res => {
          this.$store.dispatch('setToken', res.data.token)
          this.$store.dispatch('setUser', res.data.user)
        })
      this.hidden()
      // this.$router.push('/post/list')
    },
    OnGoogleAuthFail (error) {
      this.$message.error('Failed to log in. Please retry later' + error)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-footer {
    margin: 0 auto;
  }
  .signup {
    margin-bottom: 15px;
  }
  .el-form {
    width: 80%;
    .el-form-item {
      margin-left: 25%;
      width: 80%;
    }
  }
  .error-msg {
    margin-bottom: 5%;
    margin-left: 25%;
    color: red;
  }
  .el-button {
    width: 40%;
    margin-top: 10px;
  }
</style>
