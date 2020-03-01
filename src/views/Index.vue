<template>
  <el-row class="main-container">
    <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
      <div style="width: 200px">
        <el-menu id="sideBar"
                 default-active="1"
                 class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="loadPopular">
            <i class="el-icon-thumb"></i>
            <span slot="title">popular</span>
          </el-menu-item>
          <el-menu-item index="2" @click="loadPosts">
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
    </el-col>
    <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
      <div id="post">
        <h1 id="subareaTitle">{{categoryName}}</h1>
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
  </el-row>
</template>

<script>
import PostService from '../services/PostService'
let moment = require('moment')
export default {
  name: 'container',
  data () {
    return {
      allPosts: [],
      showPosts: [],
      total: 0,
      page: 1,
      pagesize: 3,
      categoryName: 'Popular'
    }
  },
  async created () {
    await this.loadPopular()
  },
  methods: {
    loadPosts: function () {
      PostService.getAllPost()
        .then(response => {
          this.categoryName = 'All'
          this.allPosts = response.data.posts
          this.formatPost()
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
    },
    showSubarea (name, key) {
      this.categoryName = name
      PostService.getSubareaPost(key)
        .then(response => {
          this.allPosts = response.data.posts
          this.formatPost()
        })
        .catch(error => {
          this.errors.push(error)
        })
    },
    loadPopular () {
      PostService.getPopular()
        .then(response => {
          this.categoryName = 'Popular'
          this.allPosts = response.data.posts
          this.formatPost()
        })
        .catch(error => {
          this.errors.push(error)
        })
    },
    formatPost () {
      var showPosts = this.allPosts.slice(0, 3)
      for (var i = 0; i < showPosts.length; i++) {
        showPosts[i].createdTime = moment(showPosts[i].createdTime).format('YYYY-MM-DD HH:mm')
      }
      this.showPosts = showPosts
      this.total = this.allPosts.length
    }
  }
}
</script>

<style scoped>
  #sideBar{
    border: transparent;
    margin-left: 8%;
    width: 200px;
    border-radius: 10px;
    margin-right: -50px;
  }
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
