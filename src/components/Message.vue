<template>
  <div>
      <div class="message" v-for="(message,index) in messages" v-bind:key="index" :class="{own: message.senderName === username}">
        <div class="username" v-if="index>0 && messages[index-1].senderName != message.senderName">{{message.senderName}}</div>
        <div class="username" v-if="index == 0">{{message.senderName}}</div>
        <div style="margin-top: 5px"></div>
        <div class="content">
          <div v-html="message.content"></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data () {
    return {}
  },
  props: [
    'messages'
  ],
  computed: {
    username () {
      return this.$store.state.user.username
    }
  }
}
</script>

<style>
  span.emoji {
    font-size: 20px;
    vertical-align: middle;
    line-height: 2;
  }
</style>
