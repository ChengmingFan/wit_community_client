<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    localStorage.getItem('userMsg') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('userMsg'))))
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('userMsg', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
</style>
