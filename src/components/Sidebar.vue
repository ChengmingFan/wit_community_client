<template>
  <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6">
    <div style="width: 200px">
      <el-menu id="sideBar"
               default-active="1"
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose">
        <el-menu-item index="1">
          <i class="el-icon-thumb"></i>
          <span slot="title">popular</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-view"></i>
          <span slot="title">all post</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-house"></i>
          <span slot="title">accommodation</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-shopping-cart-2"></i>
          <span slot="title">sale</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-time"></i>
          <span slot="title">activity</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-notebook-2"></i>
          <span slot="title">study</span>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="el-icon-more-outline"></i>
          <span slot="title">other</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-col>
</template>

<script>
export default {
  name: 'Sidebar'
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
</style>
