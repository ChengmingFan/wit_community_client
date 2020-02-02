<template>
  <section style="text-align: center;">
    <el-container>
      <el-form status-icon :rules="registerRules" :model="registerForm" ref="registerForm">
        <el-row>
          <el-col>
            <el-form-item label="" prop="username">
              <el-input name="username" v-model="registerForm.username" placeholder="username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="email">
              <el-input name="email" v-model="registerForm.email" placeholder="email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="password">
              <el-input name="password" v-model="registerForm.password" type="password" placeholder="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="comparePassword">
              <el-input name="comparePassword" v-model="registerForm.comparePassword" type="password"
                        placeholder="confirm password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-container>
    <div class="login">
      <span>Already a user? </span><a @click="login">LOG IN</a>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button style="width: 40%" type="primary" :plain="true" @click="submitForm()">SIGN UP</el-button>
    </div>
  </section>
</template>
<script>
import UserService from '../services/UserService'

export default {
  name: 'Register',
  data () {
    return {
      msg: '',
      error: '',
      registerForm: {
        username: '',
        email: '',
        password: '',
        comparePassword: ''
      },
      registerRules: {
        username: {
          type: 'string',
          required: true,
          min: 2,
          max: 20,
          message: 'Username must be between 2 and 20 characters',
          trigger: 'blur'
        },
        email: { type: 'email', required: true, message: 'The Email is invalid', trigger: 'blur' },
        password: {
          type: 'string',
          required: true,
          min: 8,
          max: 20,
          message: 'Password must be at least 8 characters long',
          trigger: 'blur'
        },
        comparePassword: {
          type: 'string',
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('Please enter the password again'))
            } else if (value !== this.registerForm.password) {
              callback(new Error('Password and Confirm Password are inconsistent!'))
            } else {
              callback()
            }
          }
        }
      }
    }
  },
  methods: {
    login () {
      this.$emit('login')
    },
    close () {
      this.$refs['registerForm'].resetFields()
      this.msg = ''
      this.error = ''
    },
    submitForm () {
      this.$refs['registerForm'].validate(async (valid) => {
        if (valid) {
          this.error = ''
          try {
            const response = await UserService.register({
              username: this.registerForm.username,
              email: this.registerForm.email,
              password: this.registerForm.password
            })
            if (response.data.code === 0) {
              this.$message.error({
                message: response.data.errorMsg,
                center: true
              })
            } else {
              this.$message.success({
                message: 'Register successfully. Please log in',
                center: true
              })
            }
          } catch (e) {
            this.$message.error({
              message: 'Failed to sign in. Please retry later',
              center: true
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-footer {
    margin: 0 auto;
  }

  .login {
    margin-bottom: 15px;
  }

  .el-form {
    width: 80%;

    .el-form-item {
      margin-left: 25%;
      width: 80%;
    }
  }
</style>
