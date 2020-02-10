<template>
  <el-col :xs="24" :sm="16" :md="16" :lg="18" :xl="18">
    <div id="post">
      <h1 id="subareaTitle">Popular</h1>
      <el-divider/>
      <div>
      <el-container v-for="post in showPosts" v-bind:key="post._id">
        <el-aside width="95px">
          <el-image
            style="width: 85px; height: 85px;margin-left: 10px"
            src="http://pic.qqkuyou.com/tximg/mfqgpgqy.jpeg"
            fit="fit"></el-image>
        </el-aside>
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
      </div>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total" @current-change="getList" :page-size="pagesize" :current-page="page">
        </el-pagination>
      </div>
    </div>
  </el-col>
</template>

<script>
import PostService from '../services/PostService'
let moment = require('moment')
export default {
  name: 'show',
  data () {
    return {
      allPosts: [],
      showPosts: [],
      total: 0,
      page: 1,
      pagesize: 3
    }
  },
  async created () {
    await this.loadPosts()
  },
  methods: {
    loadPosts: function () {
      PostService.getAllPost()
        .then(response => {
          this.allPosts = response.data.posts
          var showPosts = this.allPosts.slice(0, 3)
          for (var i = 0; i < showPosts.length; i++) {
            showPosts[i].createdTime = moment(showPosts[i].createdTime).format('YYYY-MM-DD HH:mm')
          }
          this.showPosts = showPosts
          this.total = this.allPosts.length
        })
        .catch(error => {
          this.errors.push(error)
        })
    },
    getList: function (val) {
      this.page = val
      var start = (this.page - 1) * this.pagesize
      var end = this.page * this.pagesize
      var showPosts = this.allPosts.slice(start, end)
      for (var i = 0; i < showPosts.length; i++) {
        showPosts[i].createdTime = moment(showPosts[i].createdTime).format('YYYY-MM-DD HH:mm')
      }
      this.showPosts = showPosts
    },
    getDetail (id) {
      this.$router.push({
        name: 'post-detail',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style scoped>
  #post{
    margin-left: -40px;
    height: 490px;
    width: 920px;
    background: white;
    border-radius: 10px;
    margin-right: 8%;
  }
  #subareaTitle{
    color:lightgray ;
    margin-top: 0px;
    padding-top: 10px;
    padding-left: 10px;
    margin-bottom: 0;
  }
  .el-divider{
    margin-top: 10px;
  }

  .post-body {
    margin-left: -10px;
    margin-top: -20px;
  }

  .post-info {
    color: gray;
    margin-top: 23px;
    font-size: 12px;
  }

  .hot-container {
    background: white;
  }

  h1 {
    font-size: 30px;
    padding-top: 10px;
    font-weight: normal;
    margin-bottom: -10px;
    margin-top: 5px;
  }

  h2 {
    font-weight: normal;
  }

  .title-icon {
    margin-left: 15px;
    margin-right: 10px;
  }

  p {
    margin-top: 8px;
    margin-bottom: 0px;
  }
</style>
