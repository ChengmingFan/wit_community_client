<template>
  <el-row class="main-container">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="list-container">
        <h1><span class="fas fa-list-ol title-icon"></span>  Search Result</h1>
        <div>
          <el-divider></el-divider>
          <div id="tip" v-show="noResult">No related results</div>
          <el-container v-for="post in showList" v-bind:key="post._id">
            <el-aside width="95px">
              <el-avatar v-if="post.author.avatarUrl" class="user_avatar" :size="85" shape="square" fit="fit" @click.native="$router.push('/user/profile/' + post.author._id)" :src="post.author.avatarUrl"> </el-avatar>
              <el-avatar v-else class="user_avatar" :size="85" shape="square" fit="fit" @click.native="$router.push('/user/profile/' + post.author._id)"> {{post.author.username}} </el-avatar>
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
      </div>
    </el-col>
  </el-row>
</template>

<script>
import PostService from '../../services/PostService'

export default {
  name: 'search',
  data () {
    return {
      noResult: false,
      showList: [],
      error: ''
    }
  },
  created () {
    this.loadResult(this.$route.params.keywords)
  },
  methods: {
    loadResult (keywords) {
      this.noResult = false
      PostService.searchPost(keywords)
        .then(response => {
          this.showList = response.data.posts
          if (this.showList.length === 0) {
            this.noResult = true
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    getDetail (id) {
      this.$router.push({
        name: 'post-detail',
        params: {
          id: id
        }
      })
    }
  },
  watch: {
    '$route' () {
      this.loadResult(this.$route.params.keywords)
    }
  }
}
</script>

<style scoped>
  .main-container {
    background: white;
    height: 100%;
  }

  .list-container {
    background: white;
  }

  .title {
    margin-top: -30px;
    font-size: 20px;
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

  h1 {
    font-size: 40px;
    padding-top: 10px;
    font-weight: normal;
    margin-bottom: -10px;
    margin-top: 5px;
  }

  .title-icon {
    margin-left: 15px;
    margin-right: 10px;
  }

  p {
    margin-top: 8px;
    margin-bottom: 0px;
  }

  #tip {
    color: gray;
    text-align: center;
    font-size: 30px;
  }
  .user_avatar {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
