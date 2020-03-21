<template>
  <section style="text-align: center;">
    <el-container>
      <el-form status-icon :rules="editRules" :model="editForm" ref="editForm" label-position="right" label-width="100px">
        <el-row>
          <el-col>
            <el-upload ref="upload" class="avatar-uploader" action="http://8.208.14.10:3000/upload" :show-file-list="false"
                       :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :auto-upload="true">
              <div style="display: flex;width: 200px;margin-left: 90px">
                <el-avatar v-if="editForm.avatarUrl"  id="avatar" shape="square" :size="80" fit="contain" :src="editForm.avatarUrl"></el-avatar>
                <i v-if="editForm.avatarUrl" class="el-icon-camera" style="font-size: 31px;margin-left: -30px;margin-top: 52px;"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="username" prop="username">
              <el-input name="username" v-model="editForm.username" placeholder="username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="gender" prop="gender">
              <el-radio v-model="editForm.gender" label="1">Male</el-radio>
              <el-radio v-model="editForm.gender" label="2">Female</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="bio" prop="bio">
              <el-input type="textarea" :rows="3" placeholder="bio" v-model="editForm.bio"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="country" prop="country">
              <el-input name="from" v-model="editForm.country" type="text" placeholder="where are you from"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="birthday" prop="birthday">
              <el-date-picker  style="width: 100%"
                               v-model="editForm.birthday"
                               type="date"
                               placeholder="choose birthday">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :plain="true" @click="submitForm()">Save</el-button><br/>
    </div>
  </section>
</template>

<script>
import UserService from '../services/UserService'

export default {
  name: 'EditProfile',
  data () {
    return {
      editForm: {
        avatarUrl: this.$store.state.user.avatarUrl,
        username: this.$store.state.user.username,
        gender: this.$store.state.user.gender,
        bio: this.$store.state.user.bio,
        birthday: this.$store.state.user.birthday,
        country: this.$store.state.user.country
      },
      editRules: {
        username: { type: 'string', required: true, min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur' },
        gender: { type: 'string', required: true, message: 'choose gender please' },
        birthday: { message: 'choose birthday please' }
      }
    }
  },
  methods: {
    async submitForm () {
      if (this.isFormChanged()) {
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            try {
              const response = await UserService.update({
                _id: this.$store.state.user._id,
                username: this.editForm.username,
                avatarUrl: this.editForm.avatarUrl,
                gender: this.editForm.gender,
                bio: this.editForm.bio,
                birthday: this.editForm.birthday,
                country: this.editForm.country
              })
              if (response.data.code === 0) {
                this.$message.error({
                  message: response.data.msg,
                  center: true
                })
              } else {
                this.$message.success({
                  message: response.data.msg,
                  center: true
                })
                this.$store.dispatch('setUser', response.data.user)
                this.$emit('close')
              }
            } catch (e) {
              this.$message.error('Failed to update. Please retry later')
            }
          }
        })
      } else {
        this.$emit('close')
      }
    },
    register () {
      this.$emit('register')
    },
    close () {
      this.$refs['editForm'].resetFields()
      this.error = ''
    },
    hidden () {
      this.$emit('hidden')
    },
    handleAvatarSuccess (res, file) {
      this.editForm.avatarUrl = res.url
    },
    beforeAvatarUpload (file) {
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
    isFormChanged () {
      let user = this.$store.state.user
      return this.editForm.username !== user.username || this.editForm.avatarUrl !== user.avatarUrl ||
        this.editForm.birthday !== user.birthday || this.editForm.country !== user.country || this.editForm.gender !== user.gender ||
        this.editForm.bio !== user.bio
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
  .el-button {
    width: 40%;
    margin-top: 10px;
  }
  #avatar{
    margin-left: 60%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
