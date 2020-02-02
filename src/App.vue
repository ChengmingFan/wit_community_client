<template>
  <div id="app">
    <global></global>
    <router-view></router-view>
  </div>
</template>

<script>
import global from './views/layout/global'
export default {
  name: 'app',
  components: {
    global
  }
}
</script>

<style>
</style>
