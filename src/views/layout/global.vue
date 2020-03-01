<template>
  <el-container>
    <el-header class="header" height="50px">
      <Header></Header>
    </el-header>
    <el-main id="container">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from '../../components/Header'

export default {
  name: 'Home',
  components: {
    Header
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
