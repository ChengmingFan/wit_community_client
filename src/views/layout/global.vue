<template>
  <el-container>
    <el-header class="header" height="50px">
      <Header :fullWidth="fullWidth"></Header>
    </el-header>
    <el-main id="container">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from '../../components/Header'

export default {
  data () {
    return {
      fullWidth: true
    }
  },
  name: 'Home',
  components: {
    Header
  },
  methods: {
    page_width () {
      let screenWidth = document.body.clientWidth
      console.log(screenWidth)
      if (screenWidth < 800) {
        this.fullWidth = false
      } else {
        this.fullWidth = true
      }
    }
  },
  mounted () {
    window.onresize = () => {
      this.page_width()
    }
    this.page_width()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background: white;
    color: gray;
  }
  #container {
    padding: 13px;
  }
</style>
