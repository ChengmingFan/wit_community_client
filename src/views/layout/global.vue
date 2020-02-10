<template>
  <el-container>
    <el-header class="header" height="50px">
      <Header></Header>
    </el-header>
    <el-main id="container">
      <el-row class="main-container">
        <sidebar></sidebar>
        <show></show>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Header from '../../components/Header'
import Show from '../../components/Show'
import Sidebar from '../../components/Sidebar'

export default {
  name: 'Home',
  components: {
    Show,
    Sidebar,
    Header
  }
}
</script>

<style lang="scss">
  .header {
    background: white;
    color: gray;
  }
</style>
