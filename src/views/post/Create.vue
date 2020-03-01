<template>
  <el-row class="main-container">
    <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
      <div class="create-container">
        <h1><span class="el-icon-edit title-icon"></span>New Post</h1>
        <div>
          <el-divider></el-divider>
          <div class="error-msg" v-show="error">{{error}}</div>
          <el-form status-icon label-position="top" label-width="80px" :rules="createRules" :model="createForm"
                   ref="createForm">
            <el-row>
              <el-col>
                <el-form-item label="Title" prop="title">
                  <el-input name="title" v-model="createForm.title" placeholder="title"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="Content" prop="content">
                  <el-input name="content" type="textarea" :rows="5" v-model="createForm.content" placeholder="content"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="Subarea" prop="subarea" name="subarea">
                  <el-select name="subarea" v-model="createForm.subarea" placeholder="please select subarea" style="width: 100%">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="submitForm('ruleForm')">SUBMIT</el-button>
              <el-button @click="resetForm">RESET</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="rule-container">
        <el-container>
          <el-header>
            <h2>Post Rules</h2>
          </el-header>
          <el-main id="rules">
            <p>1. Don't make rumors</p>
            <p>2. Respect others</p>
            <p>3. Don't post pornographic or violent content</p>
          </el-main>
        </el-container>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import PostService from '../../services/PostService'

export default {
  name: 'create',
  data () {
    return {
      error: '',
      createForm: {
        title: '',
        content: '',
        subarea: ''
      },
      createRules: {
        title: {
          type: 'string',
          required: true,
          max: 30,
          message: 'Title must be between 1 and 30 characters',
          trigger: 'blur'
        },
        subarea: {
          type: 'string',
          required: true,
          message: 'Please select subarea',
          trigger: 'change'
        }
      },
      options: [{
        value: 'accommodation',
        label: 'Accommodation'
      }, {
        value: 'sale',
        label: 'Sale'
      }, {
        value: 'activity',
        label: 'Activity'
      }, {
        value: 'study',
        label: 'Study'
      }, {
        value: 'other',
        label: 'Other'
      }]
    }
  },
  methods: {
    async submitForm () {
      if (!this.$store.state.isUserLogin) {
        this.$message.warning({
          message: 'Please login',
          center: true
        })
      } else {
        this.$refs['createForm'].validate(async (valid) => {
          if (valid) {
            this.error = ''
            try {
              const response = await PostService.createPost({
                title: this.createForm.title,
                content: this.createForm.content,
                subarea: this.createForm.subarea,
                creatorId: this.$store.state.user._id
              })
              if (response.data.code === 0) {
                this.$message.error({
                  message: response.data.msg,
                  center: true
                })
              } else {
                this.$router.push('/')
              }
            } catch (e) {
              this.$message.error({
                message: 'Failed to post. Please retry later',
                center: true
              })
            }
          }
        })
      }
    },
    resetForm () {
      this.$refs['createForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-container {
    border-radius: 15px;
    height: 100%;
    background: white;
    padding: 0;
  }

  .create-container {
    border-radius: 15px;
    background: white;
    height: 100px;
  }

  .rule-container {
    background: white;
  }

  h1 {
    font-size: 40px;
    font-weight: normal;
    margin: 0 0;
  }

  h2 {
    font-weight: normal;
  }

  .title-icon {
    margin-left: 15px;
    margin-right: 10px;
  }

  .el-form-item {
    width: 80%;
    margin-left: 10%;
    margin-top: -9px;
  }

  .el-button {
    width: 30%;
    margin-left: 10%;
    margin-right: 10%;
  }

  #rules {
    padding-top: 0;
  }

  .rule-container {
    border-radius: 15px;
  }

  .el-divider{
    margin-top: 8px;
    margin-bottom: 8px;
  }

</style>
